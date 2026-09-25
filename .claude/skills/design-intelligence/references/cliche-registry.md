# Cliché Registry — the tells, and the more intelligent move

Read this during Phase 5 question 7 ("would this be identifiable as AI-generated?"), and
during Phase 3 when a direction feels safe and you can't say why.

These are not banned techniques. Every one of them is correct somewhere. They are banned as
**defaults** — reached for because they are the nearest option rather than because the
Design Read asked for them. The test for each is the same: *can I justify this from the
Design Read?* If yes, use it with conviction. If no, it is filler.

---

## Structural tells

**Every product becomes a dashboard.** Not everything is a data product. A tool with three
settings is not a control centre.
→ Ask what the surface actually is: a document, a feed, a canvas, a form, a conversation, a
single decision. Design that thing.

**Every dashboard becomes a grid of cards.** Cards are a grouping tool, and grouping every
metric individually destroys comparison — which is the whole reason a dashboard exists.
→ Group by relationship, not by uniformity. Use dividers, sections, and alignment. Let the
one number that matters be large and unboxed.

**Centered hero, oversized headline, two buttons, gradient behind.** The single most
generated composition on the web.
→ Split composition, left-aligned with an asymmetric asset, a scroll-pinned structure, or a
type-only editorial opening. Centering is right for a manifesto or a launch — where the
message *is* the design — and vague everywhere else.

**Three equal feature cards, each with an icon, a title and two lines.** Three equal cards
say all three are equally important, which is almost never true.
→ Rank them. Give the strongest one more space. Or use a single narrative section, or an
asymmetric bento where size encodes importance.

**Hero → features → testimonials → pricing → CTA, with no variance.** The template that
makes every SaaS page interchangeable.
→ Order by the argument you're actually making to this audience. A skeptical technical
buyer wants proof before features. An unfamiliar category needs the problem before the
solution.

**Identical left-sidebar app layout.** It's a fine default, which is exactly why it is
invisible.
→ Consider command-driven navigation, a top bar for shallow products, contextual panels, or
a canvas with floating tools. Match the navigation shape to the information shape.

**Zigzag: image-left/text-right, then flipped, forever.** Reads as filler by the third
repetition.
→ Break it by the third section: full-width, vertical stack, grid, or a different family
entirely.

---

## Visual tells

**Purple/violet gradient as the default accent.** The single most recognisable AI signature.
→ Neutral base (zinc, slate, stone) with one high-contrast accent chosen from the brand:
emerald, electric blue, deep rose, burnt orange, cobalt. Purple is fine when the brand *is*
purple — then commit to it properly instead of applying it as a glow.

**Gradient blobs floating behind everything.** Decoration with no informational job.
→ Real imagery, a structural pattern, deliberate flat colour, or nothing. Empty space is a
legitimate design decision; blurred blobs are a way of avoiding one.

**Glassmorphism on every surface.** Frosted glass means "this floats above that". Applied
everywhere, it means nothing and hurts contrast.
→ Reserve it for genuinely floating layers — overlays, sticky bars over media. Solid
fallback under `prefers-reduced-transparency`.

**Huge border radius on everything.** Very round reads as soft and consumer; applied
indiscriminately it reads as unconsidered.
→ Pick one radius scale with a stated rule and hold it. Sharp corners are a legitimate,
under-used choice that reads as precise and serious.

**Random unmatched shadows.** Shadows imply a light source and an elevation model.
→ One elevation scale, shadows tinted toward the background hue, never pure black on light.
Or drop shadows entirely and group with borders and space.

**Everything is a pill.** Full-radius buttons, tags, inputs, badges, all at once.
→ Pills for things that are genuinely chip-like — filters, tags, toggles. Not for primary
actions and containers simultaneously.

**Sparkle / wand icons for anything AI.** Instantly dates the product to this moment.
→ Use language, or an icon that reflects what the feature actually does.

**Inter + slate-900 + a generic geometric sans.** The default stack, recognisable as such.
→ Choose type with a reason: Geist, Satoshi, Cabinet Grotesk, GT Walsheim, PP Neue Montreal,
or a well-argued serif. Inter is genuinely right for neutral, systematic, accessibility-first
work — say that's why you chose it.

**Beige + brass + espresso for every "premium craft" brief.** The second-most-recurring
default; every artisan brand becomes the same brand.
→ Rotate deliberately: cold luxury (silver/chrome/smoke), forest (deep green/bone/amber),
black-and-tan, cobalt + cream, terracotta + slate, monochrome + one saturated pop.

---

## Behavioural tells

**Everything animates on scroll.** Fade-up on every element makes the page feel slow and
communicates nothing, since it applies equally to everything.
→ Animate what benefits from sequence — a narrative reveal, a hierarchy cue, a state
change. Let the rest simply be present.

**Infinite ambient loops everywhere.** Pulsing dots, shimmering gradients, floating cards
that never settle. Movement without meaning is visual noise, and it is exhausting to use.
→ Reserve perpetual motion for genuinely live things: status, a real-time feed, a
processing indicator.

**Scroll-jacking on a page people need to scan.** Fighting the user's scroll is only
acceptable when the sequence *is* the content.
→ Use it once per page maximum, on a section that earns it, and never on anything users
return to repeatedly.

**Hover-only affordances.** Hover doesn't exist on touch, which is most traffic.
→ Anything essential must be visible or reachable by tap and keyboard. Hover is enhancement
only.

**Happy path only.** No empty, loading, or error states.
→ See `experience-completeness.md`. This is the difference between a mockup and a product.

---

## Copy tells

**Cute AI wordplay.** Forced metaphors, mock-poetic microcopy, fake humility ("we built the
boring version"), invented craftsman language.
→ Plain functional sentences. Boring copy beats clever-but-wrong copy every time.

**Fake-precise numbers.** `92% faster`, `4.1× throughput`, `48k teams` with no source.
→ Use real numbers or label mock data explicitly. Invented precision is a trust liability,
and it's the first thing a technical buyer checks.

**Multiple CTA labels for one intent.** "Get started", "Try free", "Sign up" on one page.
→ One label per intent, everywhere on the page.

**An eyebrow above every section header.** The small uppercase tracked label, repeated,
produces a templated rhythm.
→ At most one per three sections. Usually the headline alone is enough; the section's
position on the page already categorises it.

---

## Using this list

Detecting a cliché is the easy half. The question that matters is the one that follows:

> What is the more intelligent alternative *for this specific product and audience*?

Removing a cliché and leaving a hole is not an improvement. Replace it with something that
does a job the Design Read asked for — otherwise you have made the page emptier, not better.
