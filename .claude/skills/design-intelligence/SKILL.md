---
name: design-intelligence
description: >-
  Creative-direction and design-research layer that runs BEFORE any UI gets built, and
  critiques it after. Use this whenever a task involves designing, redesigning, or judging
  an interface — a landing page, dashboard, SaaS product, app screen, portfolio, component,
  brand surface, or a "make this look better / less AI / more premium" request. It decides
  what the product actually needs, studies how the best products and award-winning sites
  solve that exact problem, generates several distinct creative directions instead of the
  first plausible one, synthesizes a locked CREATIVE BRIEF, then runs a design critique
  before anything ships. It also maintains a growing pattern library so each project starts
  smarter than the last. Invoke it at the very start of design work — ahead of
  lofistack-frontend-stack, which builds what this skill decides. Also use it on its own to
  research a design landscape, choose a visual direction, critique an existing interface,
  or record a pattern worth keeping.
---

# Design Intelligence

You are not generating an interface. You are acting as a creative director, UX strategist,
and design-system thinker who happens to be able to build the thing afterwards.

The failure mode this skill exists to prevent: reaching straight for the first plausible
layout. That is how every AI interface ends up with the same centered hero, the same three
feature cards, the same violet gradient. The cure is not more decoration — it is doing the
thinking *before* the pixels, and being honest afterwards.

**Order of operations, never reversed:**
`Purpose → UX → Structure → Hierarchy → Visual language → Interaction → Motion → Detail`

You cannot decorate your way out of a weak hierarchy, and you cannot animate your way out
of a confusing interaction.

---

## Where this sits

This skill **thinks**. `lofistack-frontend-stack` **builds**. Run them in that order.

```
design-intelligence  ──  Phase 1  Decision engine   (what does this actually need?)
   (think)               Phase 2  Research          (how do the best solve it?)
                         Phase 3  Directions        (3–5 real options, not 1)
                         Phase 4  Synthesis         → CREATIVE BRIEF  ◄── the handoff
                                    │
lofistack-frontend-stack ───────────┘  tokens → taste → components → motion → QA gate
   (build)                             (the brief constrains every one of those phases)
                                    │
design-intelligence  ──  Phase 5  Critique + record ◄── before you say "done"
   (judge)
```

---

## Every phase runs, every time

**No phase is optional, and no task is too small to route through all five.** A button has a
user, a job, and a state system. A "quick fix" that skips the thinking is how a codebase
accumulates decisions nobody made on purpose, and it is the exact habit that produces
generic work — because the phase that gets skipped is always the one that would have
produced the non-obvious answer.

What scales is **depth**, never **participation**. Each phase has a floor it can shrink to
and still count:

| Phase | Floor on the smallest task | Full depth on a product |
|---|---|---|
| 1 Decision engine | The Design Read sentence, written out | Full interrogation |
| 2 Research | `kb.py coverage` run, verdict obeyed | Library + live study |
| 3 Directions | 2 named alternatives, one line each | 3–5 paragraphs, scored |
| 4 Brief | The 5 lines that constrain this change | The full brief |
| 5 Critique | Squint test + the 12 questions | Rubric + states audit |

The floor is a floor, not a target. If Phase 2 comes back THIN, you research live even on a
small task — the verdict outranks the size of the job. If a direction is genuinely obvious
from the brief, say so in one line and move; what you may not do is skip the step and
discover afterwards that you never considered an alternative.

**Mockups, wireframes and throwaway prototypes are not exempt** — they become real builds,
so a mockup designed off-pipeline just moves the problem downstream. **Non-web design is not
exempt either**: a logo, a deck, a banner, a brand system or a chart still gets Phase 1 and
Phase 5. Only the middle changes.

The whole build stack works the same way. `lofistack-frontend-stack` holds the **complete
skill registry and surface router** — the table that names the mandatory skill set for
whatever is being made (`ui-ux-pro-max`, `design-system`, `design-taste-frontend`,
`frontend-design`, `brand`, `ui-styling`, shadcn/Magic, `dataviz`, the GSAP skills,
`threejs-webgl`, `design`, `banner-design`, `slides`, plus any project-scoped skills in
`./.claude/skills/`). Read the router, announce the set you are loading, and load all of it.

---

## Phase 1 — Decision engine (never skipped)

Before any aesthetic thought, answer these. Where the brief doesn't say, infer from
context and mark the inference — do not stall on questions you can answer yourself.

1. **Who uses this**, and in what state of mind? A procurement committee, a developer at
   2am, a recruiter with 40 seconds, a nervous first-time buyer.
2. **What are they trying to finish?** Name the single job. Not "explore the product" —
   "decide whether to book a demo".
3. **What information matters most**, and what is currently drowning it out?
4. **What one action matters most?** Everything else on screen competes with it.
5. **What must feel effortless**, and what is allowed to feel deliberate and slow?
6. **What is the emotional register?** Calm, urgent, precise, warm, austere, playful.
7. **What complexity level is honest** for this product — an art gallery or a cockpit?
8. **Platform, breakpoints, accessibility floor.** Regulated, public-sector, low-vision,
   or trust-critical audiences override every aesthetic preference. No exceptions.

Then commit to a **Design Read**, one line, out loud:

> Reading this as: *[product kind]* for *[audience in their real state of mind]*, whose
> single job is *[job]*, in a *[emotional register]* register, at *[complexity level]*.

If two readings would lead to genuinely different products, ask **one** question. One. A
multi-question interrogation is a way of avoiding the decision, not making it.

Full interrogation checklist and worked examples: `references/decision-engine.md`.

---

## Phase 2 — Research: study the landscape, not the screenshots

Check the library first. It is cheaper, and it compounds.

```bash
python3 .claude/skills/design-intelligence/scripts/kb.py coverage "<product type + aesthetic + hard problem>"
```

The verdict tells you what to do next:

- **COVERED** → design from the library. `kb.py search "<query>"` to pull the entries, read
  them, move to Phase 3.
- **PARTIAL** → use what's there, then take *one* focused live look at the dimension the
  library is weakest on.
- **THIN** → research live before choosing a direction. Then write back what you learned
  (Phase 5) so this query is COVERED next time. A library that never grows is just a
  stale opinion.

### Researching live

Use WebSearch / WebFetch, or the Chrome tools when you need to see real interaction. Two
kinds of source, and you need both:

- **Craft galleries** — Awwwards, Godly, Land-book, SiteInspire, One Page Love, Dribbble,
  Behance, Product Hunt. These show what is *possible*.
- **Shipped products** — Linear, Stripe, Vercel, Notion, Arc, Raycast, Figma, Framer,
  Ramp, Mercury, Superhuman, Wise, Cash App, Shopify, Airbnb, Apple. These show what
  *survives contact with real users*. Mobbin is the shortcut for mobile flows.

A gallery site tells you what is achievable; a shipped product tells you what is
sustainable. Design from galleries alone and you ship something beautiful that nobody can
use twice.

### Extract the principle, never the screenshot

For each strong reference, the only output that matters is the transferable part:

> **Mechanism:** what is actually happening structurally.
> **Problem it solves:** the user or business problem behind it.
> **Why it works:** the perceptual or cognitive reason, not "it looks clean".
> **Where it breaks:** the context that would make this the wrong choice.
> **Transfer:** how it would apply to a product in a completely different category.

If you cannot write the *Why it works* line, you have not understood the reference and
copying it will produce a hollow imitation. Say so and look at something else.

Query strategies, source-by-source guidance, and what to look at on each: `references/research-playbook.md`.

---

## Phase 3 — Generate directions, then choose

The first workable idea is rarely the best one, and it is *always* the most predictable
one, because it is the nearest thing in the training distribution. Generate distinct
directions before committing.

Sketch 3–5, each a short paragraph — voice, layout logic, type, color behaviour, motion
posture, and the one thing that makes it memorable. They must be genuinely different
approaches, not one idea in three shades.

Useful starting archetypes — mix, don't just pick:

| | Direction | Reads as |
|---|---|---|
| A | Minimal / Swiss | Grid discipline, typographic hierarchy, near-zero ornament |
| B | Editorial / expressive | Magazine composition, asymmetry, type as the image |
| C | Premium / cinematic | Pacing, depth, restraint, one large moment |
| D | Technical / instrument | Density with dignity, mono details, data as texture |
| E | Unexpected hybrid | Two unrelated disciplines forced to cohere |

Direction E is where originality actually comes from. Originality is recombination, not
novelty for its own sake: financial-product precision + luxury retail restraint;
brutalist structure + accessible-first UX; magazine layout + real-time dashboard;
industrial-design material logic + mobile touch targets. Aim for **unexpected but
coherent** — if a choice cannot be justified by the Design Read, it is noise.

Before locking anything, check what you shipped recently:

```bash
python3 .claude/skills/design-intelligence/scripts/kb.py recent
```

If the direction you are drawn to is the same family as the last comparable project,
pick a different one. A signature is fine; a rut is not, and clients notice the rut.

Score the candidates on: usability · originality · brand fit · hierarchy clarity ·
implementation realism · emotional impact. Then **synthesize** — take the winner's
structure and graft the strongest single idea from a runner-up. Do not average them;
averaging produces mush.

Archetype detail, recombination method, scoring: `references/direction-generation.md`.

---

## Phase 4 — The Creative Brief (the handoff artifact)

Everything above collapses into one short document. This is what constrains the build —
without it, the build phases fall back on their own defaults and the thinking evaporates.

```markdown
## CREATIVE BRIEF — <project>

**Design Read:** <one line from Phase 1>
**Direction:** <name> — <2 sentences: the idea and why it beat the others>
**Borrowed from:** <references + the specific principle taken from each, not the look>

**Visual language**
- Structure: <grid / composition logic, and what breaks it deliberately>
- Typography: <display + text intent, hierarchy strategy>
- Color: <role of each value; what carries meaning vs what is neutral>
- Shape & depth: <radius scale, elevation rules, borders vs shadows>
- Density: <how much breathes, what is allowed to be tight>

**Motion posture**
- <what moves, and the reason each movement exists>
- <what deliberately stays still>

**The memorable moment**
- <the one thing a user would describe to someone else>

**Section choreography** (mandatory for any multi-section surface)
- <every section listed IN ORDER: its layout family + how the signature idea appears in it, transformed>
- <sections allowed to be still, named as deliberate stillness — silence is a choice, not a gap>

**Non-negotiables**
- <accessibility floor, brand locks, technical constraints>

**Explicitly rejected**
- <clichés ruled out for this project, and the intelligent alternative chosen instead>
```

**THE SIGNATURE IS A SYSTEM, NOT A HERO DECORATION** (hard rule, added after a measured
failure 2026-08-23: two consecutive sites shipped striking heroes over an identical generic
section skeleton — hero → cards → metrics → steps → quote → CTA — and the client called it
immediately). The memorable moment must propagate: every section either re-expresses the
signature idea in a transformed way (the hero's object reappears smaller/morphed, its
geometry becomes the section's grid, its light becomes the section's accent logic) or is
named in the brief as deliberate stillness that frames it. The section SEQUENCE itself is a
design decision derived from this product's content — never reuse the sequence of the
previous project. If the choreography block cannot say what the signature does in a section,
that section is not designed yet.

Hand this to `lofistack-frontend-stack`. In its Phase 1 the brief tells ui-ux-pro-max what
tokens to generate; in Phase 2 it tells design-taste-frontend which dials to set; in
Phases 3–4 it decides which components and which motion are on-brief. When the brief and
a downstream default disagree, **the brief wins** — that is the whole point of writing it.

---

## Phase 5 — Critique before you call it done

Run this against the built thing, not against your intention. Be genuinely adversarial:
you are looking for the reason a good designer would reject it.

**Squint test.** Blur your reading of it. Does the hierarchy still hold, or does
everything have the same weight? Same-weight is the most common structural failure.

**Five-second test.** From the first screen alone: what is this, who is it for, what do I
do next? If any answer is unclear, the problem is structural, not decorative.

**The twelve questions** — every one needs a real answer, not a nod:

1. **First impression** — does it communicate what it is without being read?
2. **Hierarchy** — is what matters most also what is seen first?
3. **Composition** — does the layout look decided, or defaulted?
4. **Typography** — is the scale a system, or improvised sizes?
5. **Color** — does every value carry meaning, or is some of it decoration?
6. **Interaction** — is behaviour predictable and reversible?
7. **Originality** — would this be identifiable as AI-generated? Name the tell.
8. **Consistency** — do the components read as one system by one author?
9. **Accessibility** — contrast, focus visibility, target size, keyboard path, motion
   sensitivity. Verified, not assumed.
10. **Responsiveness** — does the *concept* survive at 375px, or only the code?
11. **Restraint** — what is here purely because it looked cool? Remove it now.
12. **Memorability** — is there one thing worth describing to someone else?
13. **Portability tell** — take each section alone: could it be pasted into a different
    product's site unchanged and look at home there? Every section for which the answer is
    yes was defaulted, not designed. Redesign it or justify it as deliberate stillness.
14. **Sequence tell** — is the section order the same as the last project shipped? Same
    skeleton twice is a template, whatever the hero looks like.

**The craft floor** (added 2026-08-23 after a build passed structure and choreography but
was called flat — "better, but not better in design sense"). Structure passing does not mean
the design is rich. Before the final gate, check the four flatness tells:

1. **Light** — every cinematic/dark direction needs a lighting story: a source, falloff,
   bloom, atmosphere. Uniform dots or flat fills on black read as a tech demo. If the
   reference had glow, yours needs glow.
2. **Tonal depth** — one accent color is a palette DISCIPLINE, not a palette. Build a ramp
   inside the accent family (bright core, mid body, deep shadow tint) and spend it by depth.
3. **Type drama** — at least three distinct scale steps on the page and one oversized
   typographic moment. If every section shares the same heading scale and rhythm, the type
   is delivering content, not design.
4. **Texture** — grain, vignette, or material detail at low opacity is what separates
   "rendered" from "flat fill". One fixed, pointer-events-none layer is enough.

**The final gate:** would this feel credible shipped by a world-class product company? If
no, name the specific reason and iterate. "Looks fine" is not a passing answer.

Also audit completeness — a beautiful interface with unresolved empty and error states is
an unfinished product: `references/experience-completeness.md`.
Cliché detection with the intelligent alternative for each: `references/cliche-registry.md`.
Full rubric with pass/fail language: `references/critique-rubric.md`.

### Then record what you learned

This is the step that makes the skill compound. Immediately after shipping — not "later",
because later never comes and the detail is gone by then:

```bash
# A pattern worth reusing
python3 .claude/skills/design-intelligence/scripts/kb.py add --kind pattern \
  --name "Name of the pattern" \
  --description "One line: what it is and what it solves" \
  --domains "layout,motion" --product-types "saas,dashboard" \
  --tags "scroll,progressive-disclosure" --source "linear.app" \
  --body-file /tmp/entry.md

# The direction you shipped (feeds the anti-repeat ledger)
python3 .claude/skills/design-intelligence/scripts/kb.py add --kind direction \
  --name "Project — direction name" --description "One line" \
  --project "Client X" --family "cold luxury" --body "What worked, what I'd change."
```

Entries write the detail file and the index line in the same operation, so the library
never drifts out of sync with itself. Use the pattern template in
`knowledge/patterns/_TEMPLATE.md` for the body — its fields are the ones that make a
pattern transferable rather than a screenshot with extra steps.

Record a pattern when it is **transferable**: it solved a real problem, you can explain
the mechanism, and it would apply to a product in a different category. A layout you
merely liked is not a pattern.

---

## Standing principles

**Study deeply, abstract intelligently, combine unexpectedly, critique ruthlessly.**

- Techniques are tools, not personality. Glass, gradients, big type and rounded cards are
  all fine *when the Design Read asks for them* and indefensible when it doesn't.
- Complexity is not sophistication. Novelty is not originality. Beauty is not UX.
- Design the whole experience, not the hero screenshot: first run, empty, loading,
  success, error, disabled, offline, permission-denied, 400 rows, one row, no rows.
- Every component is a state system, not a rectangle. Enumerate its states before styling
  any of them.
- Motion must answer "why does this move?" — hierarchy, continuity, feedback, state, or
  progress. No answer means delete it.
- Aim for work that feels inevitable once seen, and difficult to have invented.
