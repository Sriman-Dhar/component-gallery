# Research Playbook — how to study the landscape without collecting screenshots

Read this when Phase 2 comes back THIN or PARTIAL, or when the product category is one you
have no library coverage for.

The goal is never "find something pretty to imitate". It is to come back with three or four
**transferable principles** you can defend. Imitation without understanding produces a
hollow copy, and hollow copies are obvious to exactly the people you're trying to impress.

---

## 1. Two source families, and why you need both

**Craft galleries** show what is *possible*. They are curated for impact, often built for a
single scroll-through, and frequently would not survive a second visit or a real content
load. Use them for composition, motion ideas, type ambition, and to reset your sense of
what an interface is allowed to be.

| Source | Best for |
|---|---|
| Awwwards | Experimental interaction, WebGL, motion-heavy sites, agency work |
| Godly | Curated modern web, strong signal-to-noise, good taste filter |
| Land-book | Landing pages by category, useful for "what does this industry look like" |
| SiteInspire | Editorial and studio work, strong on typography and grid |
| One Page Love | Single-page structures, narrative scroll |
| Dribbble / Behance | Visual ideas only — treat as mood, not as product; much of it never shipped |
| Pinterest | Mood, palette and 3D/cinematic direction; cross-domain steals (print, packaging, interiors, motion). Browser-only — see the Pinterest sweep below |
| Product Hunt | What is launching right now in a category, and how it positions itself |

**Shipped products** show what *survives*. They have been through real users, real support
tickets, and real edge cases. Use them for information architecture, component behaviour,
state design, density decisions, and anything a user touches more than once.

| Source | Best for |
|---|---|
| Linear | Speed-first product UI, keyboard-first, restrained motion, density done well |
| Stripe | Documentation, complex data made legible, trustworthy density |
| Vercel | Developer product surfaces, dark UI, systematic minimalism |
| Notion / Figma / Framer | Flexible canvases, progressive disclosure, contextual toolbars |
| Arc / Raycast | Command-driven interaction, opinionated navigation |
| Ramp / Mercury / Wise | Fintech clarity, numbers with dignity, trust signalling |
| Superhuman | Speed as an aesthetic, keyboard flows |
| Airbnb / Shopify / Apple | Mainstream consumer scale, accessibility, cross-device systems |
| Mobbin | Mobile flows screen-by-screen — the fastest way to study a whole journey |

Rule of thumb: if the surface will be used **once**, weight galleries. If it will be used
**daily**, weight shipped products. Marketing pages get galleries; app interiors get
products; a product that's both gets both, and they must still feel like one company.

---

## 2. Query strategy

Vague queries return the same famous handful of sites every time. Aim narrow:

- By **problem**: `dashboard with 40 metrics without feeling cluttered`,
  `onboarding for a product nobody understands in one sentence`
- By **category + quality**: `best fintech onboarding 2026`,
  `award winning architecture studio site`
- By **mechanism**: `scroll-driven product reveal`, `command palette navigation pattern`,
  `progressive disclosure in settings`
- By **anti-pattern**: `why SaaS landing pages all look the same`,
  `dashboard design mistakes` — the critique literature is unusually high-signal
- Named comparison: `sites like Linear but for [category]` — good for finding the
  second-tier examples that are often more transferable than the famous one

When you can open the real thing, do. `WebFetch` reads structure and copy; the Chrome tools
let you see hover, focus, scroll behaviour, and how it degrades at 375px. Interaction is
where most of the actual craft lives, and a screenshot hides all of it.

---

## 2b. The Pinterest sweep

Pinterest is JS-heavy: `WebFetch` cannot read it — always open it through the Chrome tools.
It is the strongest source for **mood, palette, and 3D/cinematic direction**, and the weakest
for product truth, so the procedure is strict:

1. **Search narrow.** "fintech dashboard dark 3D", "museum site hero statue", "liquid glass
   UI components" — never a bare category word. Pinterest's related-pins rail is the real
   engine: one good hit, then mine its neighbours.
2. **Follow the pin to its source.** A pin with a live site or studio behind it (click
   through / visit site) outranks an orphan image. Sandhill-style studio reels tell you the
   motion design; orphan renders only tell you the look.
3. **Extract principles, never screenshots**: palette (actual hex, sampled), type pairing
   and case, layout skeleton, lighting logic (where is the light source, what gets bloom),
   material vocabulary (glass, chrome, obsidian, liquid), and what the 3D object *is doing*
   for the message.
4. **Filter hard for AI-slop and vaporware**: fake data in the UI, impossible layouts,
   six-finger hands, no source link, engagement-bait boards. A pin can still be used as
   pure mood, but say so — it never counts as evidence a pattern works.
5. **Reality-check before promising it.** Most 3D-heavy pins are offline renders
   (Blender/C4D), not live sites. Before adopting one as a direction, decide the build path:
   real-time WebGL (threejs-webgl skill), a pre-rendered image/video asset, or a hybrid —
   and cost it. A render that needs a 4090 to hit 60fps is a poster, not a website.
6. **Study full scrolls, not hero shots.** A pin is almost always a hero crop, and heroes
   are the one thing everybody already does well. When a pin leads to a live site, scroll
   the whole thing and extract the *section-to-section choreography*: how the opening idea
   transforms as you descend, what each section borrows from the hero's geometry or light,
   where the page deliberately goes quiet. That choreography is the transferable asset;
   the hero composition is the least of it.
7. **Log the keepers** with `kb.py add` so the find outlives the session.

## 3. What to actually look at

Work through these deliberately. Most people look at colour and stop, which is why most
references get misread.

**Structure** — the grid, and where it is deliberately broken. Section rhythm: how many
layout families, in what order, and where the page changes gear. Content density, and
whether the whitespace is doing work or is just absence.

**Typography** — how many sizes exist in the whole page, the ratio between them, the
display/text pairing, measure (characters per line), and how hierarchy is built: size,
weight, colour, spacing, or position. The most sophisticated systems use fewer sizes than
you would guess and lean on weight and position instead.

**Colour** — count the values. Which carry meaning (state, action, category) and which are
neutral scaffolding? What is the accent doing, and how sparingly? How does the dark and
light variant behave — is it a real inversion or a lazy filter?

**Depth and shape** — borders vs shadows vs plain spacing for grouping. One radius scale or
several with a stated rule. Whether elevation encodes real hierarchy or is decoration.

**Interaction** — hover, focus, active, drag, loading, and empty. What is discoverable
versus what is hidden behind a shortcut. How reversible actions are. Whether feedback is
immediate.

**Motion** — what moves and what pointedly doesn't. Duration and easing character. Whether
it is state-driven (informative) or ambient (decorative). Whether it respects
`prefers-reduced-motion`.

**The thing you can't name yet** — spend a moment on why it feels the way it does. Often
it's one unusual decision: an unexpected measure, a refusal to centre anything, one
saturated colour against nine neutrals, type set much smaller than the trend.

---

## 4. The extraction format

For every reference worth keeping, produce this. If you cannot fill *Why it works*, you
have not understood it — say so and move on rather than copying a shape you can't defend.

```
REFERENCE: <name / url>
MECHANISM:      what is structurally happening
SOLVES:         the user or business problem behind it
WHY IT WORKS:   the perceptual, cognitive, or behavioural reason
BREAKS WHEN:    the context that makes this the wrong choice
TRANSFER:       how this would apply to a product in a different category
```

The *Transfer* line is the entire point. A pattern that only works on the site you found it
on is a screenshot. A pattern you can move to a different industry is design intelligence.

---

## 5. Feed the library

Anything that survived extraction goes into the knowledge base in the same session, while
you still remember the nuance:

```bash
python3 ~/.claude/skills/design-intelligence/scripts/kb.py add --kind pattern \
  --name "..." --description "..." \
  --domains "layout,typography" --product-types "fintech,saas" \
  --tags "density,trust" --source "mercury.com" --body-file /tmp/entry.md
```

Use `knowledge/patterns/_TEMPLATE.md` as the body. Research that isn't written down is
research you will pay for again next month.
