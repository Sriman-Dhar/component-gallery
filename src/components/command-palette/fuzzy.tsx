import type { MatchRange, PaletteItem } from './types';

export interface Match {
  score: number;
  /** Character ranges of the label that matched; empty when only a keyword matched. */
  ranges: MatchRange[];
  /** The keyword that matched, when the label did not: the row shows it, so a hit is never unexplained. */
  via?: string;
}

export interface Ranked {
  item: PaletteItem;
  score: number;
  ranges: MatchRange[];
  via?: string;
}

/** Scores for the parts of a match. A contiguous hit always outranks a scattered one. */
const SUBSTRING = 100;
const AT_START = 50;
const AT_WORD = 30;
const WHOLE_WORD = 15;
const PER_CHAR = 1;
const RUN = 5;
const WORD_START = 8;
const GAP = 0.2;
/** A one-typo match is worth a little over half, and must still be a tight one to count at all. */
const TYPO_FACTOR = 0.6;
const TYPO_MIN = 20;
/** A keyword hit ranks below a label hit of the same quality: the label is what the reader sees. */
const KEYWORD_FACTOR = 0.7;
/** A scattered (non-substring) match must earn this much per query character, or it is noise ("cls" in "Take calibration flats"). */
const SCATTER_MIN = 4;

/** Lowercase letters and digits only: the text is lowercased before it gets here. */
function isWordChar(code: number): boolean {
  return (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
}

function isWordStart(text: string, i: number): boolean {
  return i === 0 || !isWordChar(text.charCodeAt(i - 1));
}

function isWordEnd(text: string, i: number): boolean {
  return i >= text.length || !isWordChar(text.charCodeAt(i));
}

/** Merge sorted single indexes into [start, end) ranges. */
function toRanges(indexes: number[]): MatchRange[] {
  const ranges: MatchRange[] = [];
  for (const i of indexes) {
    const last = ranges[ranges.length - 1];
    if (last && last[1] === i) last[1] = i + 1;
    else ranges.push([i, i + 1]);
  }
  return ranges;
}

/** Walk the text once for the query's characters in order. `preferWords` jumps to a word start when one is ahead. */
function walk(q: string, text: string, preferWords: boolean): number[] | null {
  const hits: number[] = [];
  let pos = 0;
  for (let k = 0; k < q.length; k++) {
    const c = q[k];
    const prev = hits[hits.length - 1];
    if (prev !== undefined && text[prev + 1] === c) {
      hits.push(prev + 1);
      pos = prev + 2;
      continue;
    }
    let found = -1;
    if (preferWords) {
      for (let i = pos; i < text.length; i++) {
        if (text[i] === c && isWordStart(text, i)) {
          found = i;
          break;
        }
      }
    }
    if (found < 0) found = text.indexOf(c, pos);
    if (found < 0) return null;
    hits.push(found);
    pos = found + 1;
  }
  return hits;
}

function scoreHits(text: string, hits: number[]): number {
  let score = 0;
  for (let k = 0; k < hits.length; k++) {
    const i = hits[k];
    score += PER_CHAR;
    if (isWordStart(text, i)) score += WORD_START;
    if (k > 0) {
      if (hits[k - 1] === i - 1) score += RUN;
      else score -= (i - hits[k - 1] - 1) * GAP;
    }
  }
  if (hits[0] === 0) score += AT_START / 5;
  return score;
}

/** Exact match first (substring, then subsequence); null when the query's characters are not all there in order. */
function exact(q: string, text: string): Match | null {
  const at = text.indexOf(q);
  if (at >= 0) {
    let score = SUBSTRING + q.length * PER_CHAR - at * 0.5 - (text.length - q.length) * 0.1;
    if (at === 0) score += AT_START;
    else if (isWordStart(text, at)) score += AT_WORD;
    if (isWordStart(text, at) && isWordEnd(text, at + q.length)) score += WHOLE_WORD;
    return { score, ranges: [[at, at + q.length]] };
  }
  // The plain walk fails exactly when no walk can succeed, so it is the cheap reject for most items.
  const plain = walk(q, text, false);
  if (!plain) return null;
  const words = walk(q, text, true) ?? plain;
  const [hits, best] = scoreHits(text, words) >= scoreHits(text, plain) ? [words, scoreHits(text, words)] : [plain, scoreHits(text, plain)];
  if (best < q.length * SCATTER_MIN) return null;
  return { score: best - (text.length - q.length) * 0.05, ranges: toRanges(hits) };
}

/** One typo for queries of 4+ characters: drop each query character in turn (covers a wrong, extra or swapped key). */
function withTypo(q: string, text: string): Match | null {
  let best: Match | null = null;
  for (let skip = 0; skip < q.length; skip++) {
    const m = exact(q.slice(0, skip) + q.slice(skip + 1), text);
    if (m && (!best || m.score > best.score)) best = m;
  }
  if (!best) return null;
  const score = best.score * TYPO_FACTOR;
  return score >= TYPO_MIN ? { score, ranges: best.ranges } : null;
}

function matchText(q: string, text: string): Match | null {
  return exact(q, text) ?? (q.length >= 4 ? withTypo(q, text) : null);
}

/**
 * Several words: each must match the label on its own (a space is a word boundary, not ignored), and a one letter
 * word only at a word start, so "o c" means "o... c..." words, not any o and any c. Scores add up; ranges merge.
 */
function tokens(words: string[], text: string): Match | null {
  let total = 0;
  const ranges: MatchRange[] = [];
  for (const word of words) {
    const m = word.length === 1 ? initial(word, text) : matchText(word, text);
    if (!m) return null;
    total += m.score;
    ranges.push(...m.ranges);
  }
  ranges.sort((a, b) => a[0] - b[0]);
  return { score: total, ranges };
}

/** A one letter word: the first word in the text that starts with it. */
function initial(c: string, text: string): Match | null {
  for (let i = 0; i < text.length; i++) {
    if (text[i] === c && isWordStart(text, i)) return { score: PER_CHAR + WORD_START + (i === 0 ? AT_START / 5 : 0), ranges: [[i, i + 1]] };
  }
  return null;
}

/**
 * Score one label (and its keywords) against a query. Subsequence match with bonuses for a prefix, a word start,
 * a whole word and consecutive runs, plus a one-typo tolerance for queries of 4+ characters; a scattered match
 * has to clear a minimum. A query with spaces matches word by word. Null means no match. An empty query matches
 * everything with score 0.
 */
export function score(query: string, text: string, keywords: string[] = []): Match | null {
  const q = query.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!q) return { score: 0, ranges: [] };
  const lower = text.toLowerCase();
  const words = q.split(' ');
  const label = words.length > 1 ? tokens(words, lower) : matchText(q, lower);
  let keyword: { score: number; word: string } | null = null;
  for (const word of keywords) {
    // Keywords match exactly only: a typo on a hidden word would surface rows with nothing visibly matched.
    const m = exact(q, word.toLowerCase());
    if (m && (keyword === null || m.score > keyword.score)) keyword = { score: m.score, word };
  }
  const fromKeyword = keyword === null ? null : keyword.score * KEYWORD_FACTOR;
  if (label && (fromKeyword === null || label.score >= fromKeyword)) return label;
  if (keyword && fromKeyword !== null) return { score: fromKeyword, ranges: [], via: keyword.word };
  return null;
}

/** Rank items for a query: score first, then recency (ids in `recent`, newest first), then original order. */
export function rank(items: PaletteItem[], query: string, recent: string[] = []): Ranked[] {
  const out: (Ranked & { order: number; seen: number })[] = [];
  for (let order = 0; order < items.length; order++) {
    const item = items[order];
    const m = score(query, item.label, item.keywords);
    if (!m) continue;
    const seen = recent.indexOf(item.id);
    out.push({ item, score: m.score, ranges: m.ranges, via: m.via, order, seen: seen < 0 ? Infinity : seen });
  }
  out.sort((a, b) => b.score - a.score || a.seen - b.seen || a.order - b.order);
  return out.map(({ item, score: s, ranges, via }) => ({ item, score: s, ranges, via }));
}
