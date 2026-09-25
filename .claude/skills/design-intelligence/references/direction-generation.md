# Direction Generation — breadth before commitment

Read this in Phase 3 when the project is big enough to deserve real options: a product, a
brand surface, a redesign, or any brief that says "make it not look AI-generated".

The reason to generate several directions is not thoroughness for its own sake. It is that
the first idea you reach for is the *nearest* idea — the statistically most predictable
solution for that brief. Predictable is exactly the thing the work is trying not to be.

---

## 1. The archetypes

Starting points, not a menu to pick from. The good answer is usually one archetype's
structure carrying another's detail.

### A — Minimal / Swiss
Grid discipline, ruthless hierarchy, near-zero ornament. Type does the work; whitespace is
structural, not decorative. Typically 2–3 type sizes, one accent, no shadows.
**Strong for:** developer tools, B2B where credibility beats charm, dense information.
**Fails when:** the product needs warmth or emotional persuasion, or the content is too thin
to hold a rigorous grid — then it reads as empty rather than confident.

### B — Editorial / expressive
Magazine logic. Asymmetric composition, mixed type scale, text as image, deliberate rule
breaks. Rhythm changes between sections the way a magazine changes between spreads.
**Strong for:** portfolios, studios, brand-led sites, content-heavy products, anything sold
on taste.
**Fails when:** users are task-focused and repeat-visiting — expressive layouts slow down
scanning, and slowing down a daily user is a real cost.

### C — Premium / cinematic
Pacing over density. Depth, generous scale, restraint, one large moment that carries the
whole page. Motion is slow and confident; nothing is rushed.
**Strong for:** consumer premium, hardware, luxury, launches, one-visit surfaces.
**Fails when:** the user needs to compare options or find information fast, or on low-end
devices where the "moment" becomes a loading spinner.

### D — Technical / instrument
Density with dignity. Monospace details, precise alignment, data as texture, tight
controls, information over persuasion. Looks like equipment rather than marketing.
**Strong for:** dashboards, analytics, dev tools, infrastructure, fintech interiors.
**Fails when:** the audience is non-expert — instrument aesthetics read as intimidating to
people who are already unsure.

### E — Unexpected hybrid
Two unrelated disciplines forced to cohere. This is where originality actually lives, and
it is the direction most worth spending thought on.

---

## 2. Recombination — how originality is actually produced

Originality is not invention from nothing. It is a **transfer** — taking a principle that
is well-solved in one domain and applying it where nobody has. Combinations that have
produced genuinely good work:

- Editorial typography + SaaS interaction density
- Fintech numerical precision + luxury retail restraint
- Brutalist structure + accessibility-first behaviour
- Data visualization + cinematic narrative pacing
- Japanese minimalism + high-density controls
- Magazine spread rhythm + real-time dashboard
- Industrial product design (material, tolerance, weight) + touch interface
- Print signage systems + navigation
- Book design (measure, margin, running heads) + documentation
- Instrument panels (aviation, audio) + consumer app

**The test is coherence.** Ask: does the combination serve the Design Read, or is it two
ideas fighting? *Unexpected but coherent* is the target. *Unexpected and arbitrary* is just
noise wearing a costume — and it fails the critique in Phase 5 under "restraint".

A workable method when nothing is landing: name the product's core quality in one word
(*precision*, *trust*, *speed*, *care*, *scale*), then ask which non-software discipline is
famous for that exact quality, and study how it expresses it. Precision → measuring
instruments, watchmaking, technical drawing. Trust → banking print, signage, medical forms.
Care → bookbinding, ceramics, tailoring.

---

## 3. Writing a direction

One paragraph each, concrete enough to build from. Vague directions cannot be compared, so
they always collapse back to the default.

```
DIRECTION <letter> — <name>
Voice:      how it feels in three adjectives you could defend in a meeting
Structure:  the layout logic, and the one deliberate break in it
Typography: display + text intent, and how hierarchy is built
Color:      the role each value plays, not just the hex list
Motion:     posture — what moves, how fast, and why
Signature:  the one thing a user would describe to someone else afterwards
Risk:       what could make this the wrong call
```

The `Risk` line matters. A direction with no stated risk hasn't been thought about — every
real choice costs something, and naming the cost is how you compare honestly.

---

## 4. Scoring and synthesis

Score each direction 1–5 on:

| Criterion | The question |
|---|---|
| Usability | Does it help the user finish the job faster or more confidently? |
| Originality | Would someone recognize this as generated? |
| Brand fit | Does it match the Design Read, or a different product's read? |
| Hierarchy | Does the structure itself make the important thing important? |
| Realism | Can this be built well in the available scope, including states? |
| Emotion | Does it produce the intended feeling? |

Weight by the brief, don't just total the column. A public-sector service weights usability
and hierarchy far above originality. An agency portfolio weights originality and emotion.
Applying the same weights to every project is how everything ends up looking similar.

**Then synthesize rather than pick.** Take the winner's *structure* — the load-bearing part
— and graft the single strongest idea from a runner-up: a type treatment, a motion
behaviour, a colour role, a navigation model. One graft, not three. Averaging directions
produces mush, and mush is worse than any of the originals.

Write the result into the Creative Brief. Note explicitly what you rejected and why — that
paragraph is what stops the same debate from reopening halfway through the build.

---

## 5. Anti-repeat

```bash
python3 ~/.claude/skills/design-intelligence/scripts/kb.py recent
```

If your instinct matches the family at the top of that list, that is your training data
talking, not a design decision. Deliberately pick a different family and see whether it
survives scoring — it often does, and the work stops looking like it came from one mould.

Log the direction you ship. The ledger only works if it is fed.
