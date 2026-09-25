# Critique Rubric — judging the built thing honestly

Read this in Phase 5, against the interface as built, never against what you meant to
build. The purpose of a critique is to find the reason a good designer would reject the
work while there is still time to fix it.

Self-critique fails in a predictable way: you grade your intention instead of the artifact.
Guard against it by looking at the real rendered thing — screenshot it, resize it, tab
through it — before answering anything below.

---

## 1. The fast tests (do these first)

**Squint test.** Defocus. Does the hierarchy survive, or does everything carry the same
weight? Uniform weight is the most common structural failure in generated interfaces, and
it is invisible until you blur it.

**Five-second test.** From the first screen only: what is this, who is it for, what do I do
next? An unclear answer is a structural problem — do not try to fix it with a bigger
headline.

**Cover-the-colour test.** Imagine it greyscale. If the hierarchy collapses, colour is
carrying structural work it shouldn't, and the design will fail for anyone with a colour
vision deficiency, on a bad screen, or in bright sunlight.

**Real-content test.** Replace the placeholder text with the longest and shortest real
values. German-length labels, a 60-character name, an empty description, 400 rows, one row,
zero rows. Layouts that only work at demo length are unfinished.

---

## 2. The twelve questions

Every one needs a real answer. A nod is not an answer, and "looks fine" is not a grade.

**1. First impression.** Does it communicate what it is before anything is read? Does the
visual language match the category, or is it borrowed from a different kind of product?

**2. Hierarchy.** Is the most important thing also the most visible thing? Can you name the
first, second and third thing the eye lands on, and is that the order you intended?

**3. Composition.** Does the layout look decided or defaulted? Is there evidence of a grid
and of deliberate breaks in it? Is the whitespace structural or just leftover?

**4. Typography.** How many sizes exist — and does that number reflect a scale or improvised
values? Is the measure readable (45–75 characters)? Is hierarchy built with more than size
alone? Do display and text faces have a reason to be together?

**5. Colour.** Count the values. Does each carry meaning, or is some purely decorative? Is
the accent used sparingly enough to still mean "act here"? Do semantic colours (success,
warning, error) survive for colour-blind users without relying on hue alone?

**6. Interaction.** Is behaviour predictable? Is every destructive action reversible or
confirmed? Does every action produce feedback within 100ms? Is anything important hidden
behind a hover, which does not exist on touch?

**7. Originality.** Would this be identifiable as AI-generated? Name the specific tell. If
you cannot find one, look harder at the hero, the card grid, and the accent colour —
check `cliche-registry.md`. "It looks fine" usually means you have stopped looking.

**8. Consistency.** Do the components read as one system by one author? Same radius logic,
same spacing rhythm, same shadow language, same copy register, same icon family and weight?
Inconsistency reads as carelessness even when nobody can name what's wrong.

**9. Accessibility.** Verified, not assumed:
- Contrast: 4.5:1 body, 3:1 for large text and UI boundaries — measured, not eyeballed
- Focus visible on every interactive element, and the tab order matches the visual order
- Touch targets 44px minimum
- Full keyboard path through every flow, with no traps
- `prefers-reduced-motion` honoured, and the reduced version still looks intentional
- Semantic structure: real headings, labels tied to inputs, meaningful alt text
- Nothing conveyed by colour alone

**10. Responsiveness.** Does the *concept* survive at 375px, or only the code? A layout that
degrades into a single stacked column has lost its design; the mobile version needs its own
hierarchy decision, not just a breakpoint.

**11. Restraint.** What is present purely because it looked cool? Name it and remove it now.
Every animation must answer "why does this move?" with hierarchy, continuity, feedback,
state change, or progress. No answer means delete.

**12. Memorability.** Is there one thing a user would describe to someone else? If not, the
work is competent and forgettable — which for anything brand-facing is a failure, not a
neutral outcome.

---

## 3. The final gate

> Would this feel credible if it shipped from a world-class product company today?

If no, name the specific reason and iterate. The reason is almost always one of:

- The hierarchy is flat — everything is competing
- The type system is improvised rather than scaled
- There is no point of view — it could be any product in the category
- The states are unfinished — it only works on the happy path
- The motion is decorative — it moves without meaning
- It is a competent execution of the most obvious idea

---

## 4. Reporting the critique

Be specific and non-defensive. Vague self-praise helps nobody, and vague self-criticism is
just as useless.

```markdown
## Design critique — <surface>

**Verdict:** ship / iterate / rethink

**Working**
- <specific thing, and the reason it works>

**Failing**
- <specific thing> → <the fix, concretely>

**Verified**
- <what was actually measured or tested: contrast values, 375px render, keyboard path>

**Not verified**
- <what was not checked, and why>
```

That last section is not optional. Claiming a design passes accessibility without having
measured contrast is a false statement about the product, not a rounding error — and it is
the kind of claim that gets discovered by a user rather than by you.
