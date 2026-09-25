#!/usr/bin/env python3
"""Knowledge-base tool for the design-intelligence skill.

The KB is a folder of markdown files with YAML-ish frontmatter. This script exists so
that reading, searching and *writing* entries is deterministic — in particular so that
every new entry updates both the detail file and INDEX.md in the same operation, which
is what keeps the library trustworthy across many sessions.

Commands
  search   <query>            rank entries by relevance, print the top matches
  coverage <query>            answer one question: is the library THIN here or COVERED?
  add                         write a new entry + its INDEX.md line (see --help)
  recent                      last N directions shipped (anti-repeat ledger)
  list                        everything, grouped by kind
  reindex                     rebuild INDEX.md from the files on disk
"""

from __future__ import annotations

import argparse
import datetime as _dt
import re
import sys
from pathlib import Path

KB = Path(__file__).resolve().parent.parent / "knowledge"
INDEX = KB / "INDEX.md"
KINDS = {"pattern": KB / "patterns", "direction": KB / "directions"}

STOP = {
    "a", "an", "and", "the", "for", "with", "that", "this", "into", "from", "your",
    "our", "it", "its", "of", "to", "in", "on", "is", "are", "be", "as", "at", "by",
    "or", "not", "but", "so", "if", "then", "than", "want", "need", "make", "build",
    "design", "page", "site", "website", "app", "ui", "ux",
}

# Field weights: a hit in the name matters far more than a hit deep in the body.
WEIGHTS = {"name": 6.0, "tags": 4.0, "product_types": 4.0, "domains": 3.0,
           "description": 3.0, "body": 1.0}


# ---------------------------------------------------------------- parsing


def _split_front_matter(text: str) -> tuple[dict, str]:
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    raw, body = text[3:end], text[end + 4:]
    meta: dict[str, object] = {}
    for line in raw.splitlines():
        if not line.strip() or line.lstrip().startswith("#") or ":" not in line:
            continue
        key, _, value = line.partition(":")
        key, value = key.strip(), value.strip()
        if value.startswith("[") and value.endswith("]"):
            meta[key] = [v.strip().strip("'\"") for v in value[1:-1].split(",") if v.strip()]
        else:
            meta[key] = value.strip("'\"")
    return meta, body


class Entry:
    def __init__(self, path: Path):
        self.path = path
        self.meta, self.body = _split_front_matter(path.read_text(encoding="utf-8"))
        self.kind = path.parent.name.rstrip("s")

    def field(self, key: str) -> str:
        value = self.meta.get(key, "")
        return " ".join(value) if isinstance(value, list) else str(value)

    @property
    def name(self) -> str:
        return self.field("name") or self.path.stem

    @property
    def description(self) -> str:
        return self.field("description")

    def score(self, terms: set[str]) -> float:
        if not terms:
            return 0.0
        total = 0.0
        for key, weight in WEIGHTS.items():
            haystack = (self.body if key == "body" else self.field(key)).lower()
            if not haystack:
                continue
            for term in terms:
                if term in haystack:
                    total += weight
        return total


def load(kind: str | None = None) -> list[Entry]:
    dirs = [KINDS[kind]] if kind in KINDS else list(KINDS.values())
    entries = []
    for d in dirs:
        if d.exists():
            # Leading underscore marks scaffolding (templates), not library content.
            entries += [Entry(p) for p in sorted(d.glob("*.md")) if not p.name.startswith("_")]
    return entries


def terms_of(query: str) -> set[str]:
    words = re.findall(r"[a-z0-9]{3,}", query.lower())
    return {w for w in words if w not in STOP}


# ---------------------------------------------------------------- commands


def cmd_search(args) -> int:
    terms = terms_of(args.query)
    ranked = [(e.score(terms), e) for e in load(args.kind)]
    ranked = sorted([r for r in ranked if r[0] > 0], key=lambda r: -r[0])[: args.limit]
    if not ranked:
        print(f"No entries matched: {args.query}")
        print("The library is thin here — research this one live, then record what you learn.")
        return 0
    print(f"{len(ranked)} match(es) for: {args.query}\n")
    for score, e in ranked:
        rel = e.path.relative_to(KB)
        print(f"  [{score:5.1f}] {e.name}  ({e.kind})")
        if e.description:
            print(f"           {e.description}")
        print(f"           read: knowledge/{rel}\n")
    return 0


def cmd_coverage(args) -> int:
    """One question, one answer: do I already know enough to skip live research?"""
    terms = terms_of(args.query)
    scored = sorted([(e.score(terms), e) for e in load()], key=lambda r: -r[0])
    strong = [e for s, e in scored if s >= args.threshold]
    weak = [e for s, e in scored if 0 < s < args.threshold]

    print(f"Query: {args.query}")
    print(f"Strong matches: {len(strong)}   Weak: {len(weak)}   Library size: {len(scored)}\n")
    if len(strong) >= 3:
        print("VERDICT: COVERED — design from the library, skip live research.")
    elif len(strong) >= 1:
        print("VERDICT: PARTIAL — library gives you a starting point; one focused")
        print("         live look at the weakest dimension is worth it.")
    else:
        print("VERDICT: THIN — research this live before choosing a direction,")
        print("         then write back what you learned so the next task is cheaper.")
    print()
    for e in (strong or weak)[:6]:
        print(f"  - {e.name}: {e.description}")
    return 0


def cmd_recent(args) -> int:
    """Anti-repeat ledger: what aesthetic families shipped most recently."""
    entries = load("direction")
    entries.sort(key=lambda e: e.field("shipped") or e.field("added"), reverse=True)
    if not entries:
        print("No directions logged yet. Log one after every project you ship.")
        return 0
    print("Most recent directions shipped (do not repeat the top of this list):\n")
    for e in entries[: args.limit]:
        when = e.field("shipped") or e.field("added") or "?"
        print(f"  {when}  {e.name}")
        print(f"             family: {e.field('family') or '?'} | project: {e.field('project') or '?'}")
        if e.description:
            print(f"             {e.description}")
        print()
    return 0


def cmd_list(args) -> int:
    for kind, d in KINDS.items():
        entries = load(kind)
        print(f"\n{kind.upper()}S ({len(entries)})")
        for e in entries:
            print(f"  - {e.name}: {e.description}")
    print()
    return 0


def _slug(text: str) -> str:
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", text.lower())).strip("-")


def cmd_add(args) -> int:
    kind = args.kind
    if kind not in KINDS:
        print(f"kind must be one of: {', '.join(KINDS)}")
        return 1
    slug = _slug(args.name)
    path = KINDS[kind] / f"{slug}.md"
    if path.exists() and not args.force:
        print(f"{path} already exists. Edit it, or pass --force to overwrite.")
        return 1

    today = args.date or _dt.date.today().isoformat()
    listify = lambda v: "[" + ", ".join(x.strip() for x in v.split(",") if x.strip()) + "]"

    lines = ["---", f"name: {args.name}", f"description: {args.description}"]
    if kind == "pattern":
        lines += [f"domains: {listify(args.domains or '')}",
                  f"product_types: {listify(args.product_types or '')}"]
    else:
        lines += [f"project: {args.project or ''}", f"family: {args.family or ''}",
                  f"shipped: {today}"]
    lines += [f"tags: {listify(args.tags or '')}", f"source: {args.source or ''}",
              f"added: {today}", "---", ""]

    body = Path(args.body_file).read_text(encoding="utf-8") if args.body_file else args.body or ""
    path.write_text("\n".join(lines) + body.rstrip() + "\n", encoding="utf-8")

    _write_index()
    print(f"Wrote  knowledge/{path.relative_to(KB)}")
    print("Updated knowledge/INDEX.md")
    return 0


def _write_index() -> None:
    out = ["# Design Intelligence — Library Index", "",
           "One line per entry. Generated by `scripts/kb.py`; do not hand-edit.",
           "Search it with `kb.py search`, not by reading this whole file.", ""]
    for kind, _ in KINDS.items():
        entries = load(kind)
        out.append(f"## {kind.capitalize()}s ({len(entries)})")
        out.append("")
        for e in entries:
            rel = e.path.relative_to(KB)
            extra = ""
            if kind == "direction":
                extra = f" — _{e.field('family')}, {e.field('project')}, {e.field('shipped')}_"
            out.append(f"- [{e.name}]({rel}) — {e.description}{extra}")
        out.append("")
    INDEX.write_text("\n".join(out), encoding="utf-8")


def cmd_reindex(_args) -> int:
    _write_index()
    print(f"Rebuilt {INDEX} from {len(load())} entries.")
    return 0


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("search", help="rank entries by relevance")
    s.add_argument("query")
    s.add_argument("--kind", choices=list(KINDS))
    s.add_argument("--limit", type=int, default=6)
    s.set_defaults(func=cmd_search)

    c = sub.add_parser("coverage", help="THIN / PARTIAL / COVERED verdict")
    c.add_argument("query")
    c.add_argument("--threshold", type=float, default=8.0)
    c.set_defaults(func=cmd_coverage)

    r = sub.add_parser("recent", help="recently shipped directions (anti-repeat)")
    r.add_argument("--limit", type=int, default=8)
    r.set_defaults(func=cmd_recent)

    sub.add_parser("list", help="list everything").set_defaults(func=cmd_list)
    sub.add_parser("reindex", help="rebuild INDEX.md").set_defaults(func=cmd_reindex)

    a = sub.add_parser("add", help="write an entry + its index line")
    a.add_argument("--kind", required=True, choices=list(KINDS))
    a.add_argument("--name", required=True)
    a.add_argument("--description", required=True)
    a.add_argument("--domains", help="pattern only, comma-separated")
    a.add_argument("--product-types", dest="product_types", help="pattern only, comma-separated")
    a.add_argument("--project", help="direction only")
    a.add_argument("--family", help="direction only, e.g. 'cold luxury' / 'editorial brutalist'")
    a.add_argument("--tags")
    a.add_argument("--source", help="URL or product name the insight came from")
    a.add_argument("--date")
    a.add_argument("--body", help="markdown body inline")
    a.add_argument("--body-file", dest="body_file", help="read the markdown body from a file")
    a.add_argument("--force", action="store_true")
    a.set_defaults(func=cmd_add)

    args = p.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
