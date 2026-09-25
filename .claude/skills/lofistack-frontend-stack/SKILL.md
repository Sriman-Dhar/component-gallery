---
name: lofistack-frontend-stack
description: >-
  Master design pipeline and skill router for ANY design work, on any project. Use it for
  landing pages, dashboards, SaaS frontends, marketing sites, portfolios, admin panels, PWAs,
  components, heroes, pricing sections, bento grids, redesigns and visual polish — and equally
  for mockups, wireframes, prototypes, throwaway HTML, logos, icons, brand identity, banners,
  ads, social creative, decks and presentations, and any chart, graph or data visualization.
  It routes every design-capable skill on the machine so none is silently skipped: it holds a
  complete skill registry and a surface router that names the mandatory set for whatever is
  being made. Order: design-intelligence (decision engine, research, directions, CREATIVE
  BRIEF) → ui-ux-pro-max + design-system (tokens and their architecture) + brand →
  design-taste-frontend + frontend-design (taste/anti-slop) → shadcn MCP + 21st.dev Magic MCP
  + ui-styling (components) + dataviz (any chart) → GSAP skills (DOM motion) + threejs-webgl
  (3D/WebGL/shaders/particles) → UX QA gate → design-intelligence critique. EVERY phase runs
  EVERY time, no matter how small the task; size changes the depth of each phase, never
  whether it runs. Mockups and non-web design are not exempt. Invoke this before writing any
  UI code or picking any aesthetic. Stack defaults: React + TypeScript + Tailwind, modular and
  reusable for cloning across client and JV projects.
---

# LofiStack Frontend Stack — Orchestrator

This is the **precedence and pipeline controller** for all frontend/design work. It coordinates
six specialist layers so they never conflict. Run the phases **in order**.

## EVERY SKILL, EVERY TIME (binding, no exceptions)

**Every phase below runs on every frontend task, regardless of how small the task is.** A
one-line CSS tweak, a single button, a whole product — all of them route through the full
stack. There is no "too small to bother" threshold, because that threshold is exactly where
generic work comes from: the skipped phase is always the one that would have produced the
better answer.

What scales is **how deep each phase goes**, never **whether it runs**:

| Task size | What changes |
|---|---|
| One component / small fix | Each phase compresses to its floor — a one-line design read, a `kb.py coverage` check, two named alternatives, a five-line brief, the critique questions. Minutes, not hours. |
| A page or section | Full Phase 0 brief, full token pass, full QA gate and critique. |
| A product or redesign | Everything at full depth, plus live research and a states audit. |

If a phase genuinely does not apply (no 3D on a text-only component, no Magic MCP when
shadcn covers it), say so explicitly in one line and move on. Silence is not a decision, and
"it seemed small" is not a reason.

**Mockups are not exempt.** A mockup, a wireframe, a "rough version", a throwaway HTML file,
a screenshot for a client — all of it routes through the full pipeline. Mockups become real
builds around here, so a mockup designed off-pipeline just moves the slop downstream.

**Non-web design is not exempt either.** A logo, a deck, a banner, a brand system, a chart —
these still run Phase 0 (decision engine → brief) and the final critique. The middle phases
change; the thinking and the judging do not.

## THE COMPLETE DESIGN SKILL REGISTRY

Every design-capable skill on this machine, and exactly when it loads. Consult this table on
every design task so nothing is skipped by forgetting it exists.

| Skill | Loads when |
|---|---|
| **design-intelligence** | **ALWAYS** — Phase 0 brief and the closing critique, on every design task of any kind |
| **ui-ux-pro-max** | **ALWAYS** — tokens, palettes, type pairings, and the UX validation gate |
| **design-system** | **ALWAYS when tokens or components are produced** — three-layer token architecture (primitive → semantic → component), component specs |
| **design-taste-frontend** | Any web/app/screen surface — anti-slop, layout variance, motion direction |
| **frontend-design** | Any web/app/screen surface — aesthetic direction and typography; pairs with taste, load both |
| **brand** | Any surface carrying a brand: marketing, client work, identity, tone of voice, style guides |
| **ui-styling** | Any shadcn/Tailwind implementation — accessible components, dark mode, theming |
| **shadcn MCP** → **21st.dev Magic MCP** | Any component implementation. Primitives from shadcn, marketing/novel from Magic |
| **gsap-core/-react/-timeline/-scrolltrigger/-plugins/-utils/-frameworks/-performance** | Any DOM motion |
| **threejs-webgl** | Any 3D, WebGL, shader, particle, or immersive layer |
| **remotion-video** | Any deliverable that ships as a rendered file: video, GIF, or social still |
| **remotion-markup** / **remotion-maps** | Sub-skills of remotion-video: markup = content, animation and effect best practices inside a composition; maps = animated map scenes. Load with remotion-video when the shot has text/effects or a map |
| **game-retention-design** / **game-monetization** | Any 2D game surface (idle, clicker, merge, tycoon): retention-design decides loop, hooks, economy and daily systems BEFORE screens; monetization decides ad placement and consent UI. Load with game-dev-2d |
| **dataviz** | **Any chart, graph, plot, dashboard, KPI tile, or stat row — read BEFORE the first line of chart code** |
| **design** (umbrella) | Logo, icon, corporate identity, social image, mockup deliverables |
| **banner-design** | Banners, ads, social creative, print |
| **slides** | Any presentation or deck |
| **artifact-design** / **artifact-diagramming** | Anything published as an Artifact |
| **ghl-workflow-json-builder** | Any HighLevel workflow build/edit — the workflow *is* the designed surface; loads with design-intelligence for the flow read |
| **accessibility-review** / **design-critique** / **ux-copy** / **design-handoff** | Phase 5 and 6 helpers on any screen: WCAG 2.1 AA audit, structured critique, microcopy (errors, empty states, CTAs), developer handoff spec when a mockup ships to a builder |
| **brand-guidelines** / **brand-review** / **brand-style** | Branded surfaces beside `brand`: brand-guidelines = Anthropic palette only (artifacts), brand-review = copy vs voice, brand-style = small-business style sheet |
| **canvas-design** / **theme-factory** / **web-artifacts-builder** | Visual art as PNG/PDF; themed artifacts; multi-component claude.ai artifacts (loads with artifact-design) |
| **create-viz** / **data-visualization** | Python-rendered charts (matplotlib, seaborn, plotly) — dataviz still reads first for form and colour |
| **pptx** / **slack-gif-creator** | A .pptx file in or out (with slides); animated GIFs for chat tools (with remotion-video when rendered) |
| **project-scoped skills** | **Check `./.claude/skills/` FIRST on every project** — e.g. `lofi-motion` and `responsive-pass` exist in the LofiStack frontends and override general guidance for those repos |

## SURFACE ROUTER — what am I making?

Find the row, load everything in it. This removes the judgment call about which skills apply.

| Building | Mandatory set |
|---|---|
| Website, landing, marketing page | design-intelligence · ui-ux-pro-max · design-system · design-taste-frontend · frontend-design · brand · ui-styling · shadcn/Magic · GSAP · threejs-webgl (if immersive) |
| Web app, dashboard, admin, PWA | design-intelligence · ui-ux-pro-max · design-system · design-taste-frontend · frontend-design · ui-styling · shadcn/Magic · GSAP · **dataviz** (any chart at all) |
| Single component or small fix | design-intelligence · ui-ux-pro-max · design-system · design-taste-frontend · frontend-design · ui-styling · shadcn · GSAP (if it moves) |
| Mockup, wireframe, prototype | Same as the surface it mocks. No reductions. |
| Logo, icon, identity | design-intelligence · brand · design · ui-ux-pro-max |
| Banner, ad, social creative | design-intelligence · brand · banner-design · ui-ux-pro-max |
| Deck or presentation | design-intelligence · brand · slides · design-system · dataviz (if it has charts) |
| Chart or data visualization | design-intelligence · **dataviz** · ui-ux-pro-max · design-system |
| Rendered video / motion export (LinkedIn clip, product demo, class clip, ad creative) | design-intelligence · ui-ux-pro-max · design-system · design-taste-frontend · frontend-design · brand · **remotion-video** · **remotion-markup** (text, animation, effects in the shot) · **remotion-maps** (if a map is in the shot) · threejs-webgl (if a 3D scene is in the shot) |
| 2D game screen, HUD, shop, daily-reward or ad flow | design-intelligence · ui-ux-pro-max · design-system · design-taste-frontend · frontend-design · **game-retention-design** (loop + economy first) · **game-monetization** (ad placement + consent UI) · game-dev-2d · GSAP (if DOM overlay moves) |
| HighLevel workflow (nodes/branches/triggers) | design-intelligence · ghl-workflow-json-builder |
| Published Artifact page | The surface row above **plus** artifact-design (+ artifact-diagramming if it has diagrams) |

**Announce the set.** Before building, state which row you are on and list the skills being
loaded. That one line is what makes a skipped skill visible instead of silent.

## LOADING MEANS A TOOL CALL, NOT A MENTION

Measured failure, 2026-08-12: a real run of this pipeline named `design-taste-frontend`,
`frontend-design`, `brand`, `ui-styling` and the GSAP skills in its write-up, invoked **none of
them**, and never ran the ui-ux-pro-max script — while believing it had run the full stack.
This is the single most likely way this pipeline degrades, because reciting the rules feels
identical from the inside to following them.

**You have not loaded a skill until you have called the Skill tool on it.** Reading this file
gives you a summary of what those skills say; a summary is not the skill. The details that stop
generic output — the banned palettes, the eyebrow cap, the zigzag limit, the italic descender
rule — live in the skill files and nowhere else.

Two concrete obligations:

1. **Call `Skill` on every entry in your surface row.** If the row lists six skills, there are
   six invocations. Batch them, but make them.
2. **Phase 1 requires actually running the script.** Quoting ui-ux-pro-max from memory is not
   running ui-ux-pro-max. The command must appear in your transcript.

**Self-check before you write any UI code** — answer these out loud, in one line:
> Skills invoked so far: `<list>`. Surface row requires: `<list>`. Missing: `<none | list>`.

If "Missing" is not `none`, invoke them before continuing. A skill you meant to load and didn't
is the same as one you skipped.

## Stack Defaults (override only if the brief says otherwise)

- **Framework:** React + TypeScript + Tailwind CSS.
- **Output shape:** modular, reusable components — small files, one responsibility each, so any
  piece can be cloned across client and JV projects. No god-files, no dead code.
- **Brand bias (default identity):** dark backgrounds, neon gradient accents, **Lexend** font,
  subtle AI / particle aesthetics. This is the house look — apply it unless the brief specifies a
  different direction, in which case the brief wins.

## The Pipeline (run in this exact order)

### Phase 0 — CREATIVE DIRECTION (design-intelligence)
Decide **what the product needs** before deciding what it looks like. Invoke the
`design-intelligence` skill and run its Phases 1–4: decision engine → research (library
first, live when thin) → 3–5 distinct directions → synthesis into a **CREATIVE BRIEF**.

The brief is the input to everything below. Without it, each phase below falls back on its
own defaults and the output converges on the same generic interface every time.

- **Scale it to the task** — a one-component fix gets a three-line design read, a product or
  redesign gets the full pass. design-intelligence has the scaling table; state which row
  you are on.
- **Anti-repeat:** check `kb.py recent` before locking a direction so consecutive projects
  don't ship the same aesthetic family.

**Output of this phase:** a CREATIVE BRIEF naming the design read, the chosen direction, the
visual language, the motion posture, the memorable moment, and what was explicitly rejected.

### Phase 1 — DESIGN SYSTEM (ui-ux-pro-max)
Lock the palette, typography, and layout pattern **before writing any UI code** — generating
tokens that express the Phase 0 brief, not generic defaults.

**Run this command. It is not optional and it is not replaceable by recalling what
ui-ux-pro-max usually returns** — its actual output is what you accept or reject against the
brief, and you cannot reject output you never generated:

```
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<project + vibe>" --design-system -p "<ProjectName>"
```

Expect to disagree with some of it. On a trust-first fintech brief it returned a purple accent,
ambient blobs and glassmorphism (verified 2026-08-12). Overriding it against the brief is the
process working; skipping it means you never had the palette, type pairing or layout pattern it
would have proposed, and you silently fell back to your own defaults — which is exactly the
generic output this pipeline exists to prevent.

- Add `--persist` to write a reusable design system to `design-system/MASTER.md`, and
  `--page "<name>"` to emit a page-specific override — do this for real projects so tokens are
  cloneable.
- Drill into any dimension with the search domains when you need detail:
  `search.py "<query>" --domain style|color|typography|landing|product|ux|chart|icons`.
- Apply the house brand bias (dark + neon gradient + Lexend + subtle AI/particle) unless the
  brief overrides it.

**Also load `design-system` here.** ui-ux-pro-max picks the values; design-system gives them
architecture — primitive → semantic → component layering, CSS variables, spacing and type
scales, component specs. Values without architecture become a pile of hex codes that drift
the moment a second person touches them.

**Load `brand` here too when the surface carries a brand** (client work, marketing, identity),
so voice and visual identity are decided with the tokens rather than bolted on afterwards.

**Output of this phase:** a locked, layered set of design tokens — colors, typography scale,
spacing, layout pattern, component specs. Everything downstream conforms to these tokens.

### Phase 2 — TASTE PASS (design-taste-frontend + frontend-design)
Layer the anti-slop / taste rules **on top of** the locked design system for layout variance and
distinctiveness. Invoke the `design-taste-frontend` skill and apply its audit-first + pre-flight
discipline.

**Load `frontend-design` alongside it — both, not either.** design-taste-frontend is the
rulebook (what is banned, what the dials are); frontend-design is the judgement (aesthetic
direction, typography, avoiding templated defaults). They cover the same ground from different
angles and the overlap is the point.

Set its dials from the Phase 0 brief — the design read already implies the variance, motion
and density values, so don't re-derive them from scratch.

**CONFLICT RESOLUTION (binding):**
- **The Phase 0 CREATIVE BRIEF WINS over everything** — it is the project's intent. A
  downstream default that contradicts the brief loses. That is the entire reason the brief
  is written down.
- **ui-ux-pro-max WINS on design tokens** — colors, typography, spacing scales. Taste does not
  recolor or re-typeface what Phase 1 locked.
- **design-taste-frontend WINS on layout and motion direction** — composition, section rhythm,
  where things sit, how they move, and what NOT to do (anti-generic enforcement).

### Phase 3 — COMPONENTS (shadcn MCP → 21st.dev Magic MCP, when available)
Never hand-roll a component that already exists.

**Not available here, skip:** the shadcn MCP and the 21st.dev Magic MCP are not connected in
Claude Code cloud. Do not fake their output. Skip the two MCP queries below, say so in the
summary, and hand-build the component with Tailwind against the locked tokens instead — this
gallery also disallows component libraries (no shadcn install, no MUI, no Chakra), so a
hand-built component is the expected path here regardless of MCP availability.

- **Standard primitives** (button, input, dialog, dropdown, table, form, tabs, card, sheet, etc.):
  where the MCP is available, query the **shadcn MCP** for the real, current component API
  before writing code and use the actual API — do not guess props. Here, build it by hand.
- **Novel / marketing components** (heroes, pricing sections, bento grids, feature showcases,
  animated CTAs): where the MCP is available, pull variants from the **21st.dev Magic MCP** and
  adapt them to the locked tokens. Here, design and build it by hand against the brief.
- **Rule:** if shadcn provides it, use shadcn. Only reach for Magic MCP for the marketing/novel
  surface shadcn doesn't cover. Never hand-roll a primitive shadcn already ships — unless
  neither MCP is available, in which case hand-building is correct.
- **Load `ui-styling`** for the implementation itself — shadcn/Radix patterns, Tailwind
  composition, theming, dark mode, and the accessibility behaviour of dialogs, forms, tables
  and dropdowns.
- **A registry result may be rejected.** "Never hand-roll" does not mean "accept what the
  registry returns". If the results are off-brief, say so with a reason and build it properly.
  Verified 2026-08-12: Magic returned six heroes at max confidence 0.61, every one off-brief.

- **Any chart, graph, dashboard tile, sparkline or KPI row → load `dataviz` BEFORE writing the
  first line of chart code.** Not after, not "if it looks off". Chart colour, mark choice and
  legend/axis decisions are extremely hard to retrofit once the chart exists.

### Phase 4 — MOTION (GSAP skills + threejs-webgl)
All animation goes through the official GSAP skills. No hand-rolled `requestAnimationFrame` loops,
no raw scroll listeners.

**Routing rule — DOM vs WebGL:**
- **DOM/CSS motion** (transforms, reveals, pinning, SplitText, layout moves) → GSAP skills below.
- **3D, shaders, particles, image distortion, immersive heroes, generative backgrounds** — anything
  DOM/CSS cannot render → invoke the **threejs-webgl** skill. It owns the R3F/shader layer, its own
  performance budget, and its fallback rules (reduced-motion, no-WebGL poster). When both layers
  exist on a page, ScrollTrigger is the single scroll source of truth and the 3D scene reads from
  it (threejs-webgl documents the bridge).
- The award-winning bar usually wants BOTH: GSAP choreography for the DOM + one strong WebGL
  moment. Consider the threejs-webgl "does this need WebGL?" table before deciding — don't add 3D
  gratuitously, and don't ship flat when the brief asks for immersive.

- **React:** use `gsap-react` — `useGSAP()` + `contextSafe` for event-bound animations, with
  proper cleanup on unmount. (Non-React frameworks → `gsap-frameworks`.)
- **Core tweens/easing/stagger:** `gsap-core`. **Sequencing:** `gsap-timeline`.
- **Scroll-driven** (pinning, scrub, parallax, reveals): `gsap-scrolltrigger`.
- **Plugins** (SplitText, Flip, Draggable, ScrollSmoother, etc.): `gsap-plugins`.
- **Helpers:** `gsap-utils`. **Smoothness/60fps:** `gsap-performance`.
- Always honor `prefers-reduced-motion` (via `gsap.matchMedia()`).

### Phase 5 — QA GATE (ui-ux-pro-max UX validation) — DO NOT declare done before this
Run UX validation and reject AI-slop before shipping:

```
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<component/page>" --domain ux
```

Check every item:
- **Animation:** cleanup on unmount, reduced-motion respected, no jank.
- **Accessibility:** contrast passes (WCAG AA+), visible focus states on all interactive elements,
  proper roles/labels.
- **Z-index & layering:** no stacking bugs, overlays/modals above content.
- **Loading / empty / error states:** present, not just the happy path.
- **Reject AI-slop unless explicitly requested:** no centered 3-card feature rows, no
  purple-on-white generic gradients, no templated hero → features → CTA with zero variance.

If the page has a WebGL layer, the threejs-webgl QA gate ALSO applies (fps on throttled CPU,
DPR cap, reduced-motion beauty frame, no-WebGL poster, disposal audit).

### Phase 6 — DESIGN CRITIQUE + RECORD (design-intelligence)
The Phase 5 gate proves the build is technically sound. It does not prove the design is any
good — those are different questions, and shipping a technically clean generic interface is
still shipping a generic interface.

Return to `design-intelligence` Phase 5: squint test, five-second test, the twelve critique
questions, the completeness audit, and the final gate ("would a world-class product company
ship this?"). Then log what you learned:

- Any transferable pattern → `kb.py add --kind pattern`
- The direction you shipped → `kb.py add --kind direction` (feeds the anti-repeat ledger)

**Definition of done for any UI task:** creative brief written (Phase 0) · tokens locked
(Phase 1) · taste applied (Phase 2) · components sourced from shadcn/Magic not hand-rolled
(Phase 3) · motion via GSAP with cleanup, 3D/shader work via threejs-webgl (Phase 4) · QA gate
passed, incl. the threejs-webgl gate when WebGL is present (Phase 5) · design critique passed
and the library updated (Phase 6). State what was and was not verified.

## Precedence summary (memorize)
0. **Intent** → the design-intelligence CREATIVE BRIEF wins over every default below.
0b. **Project-scoped skills** (`./.claude/skills/`) win over general guidance in that repo.
1. **Tokens/color/type** → ui-ux-pro-max wins; design-system owns their architecture.
2. **Layout/motion direction** → design-taste-frontend wins; frontend-design refines taste.
3. **Primitives** → shadcn MCP. **Marketing/novel** → 21st.dev Magic MCP. Never hand-roll.
4. **DOM animation** → GSAP skills only. **3D/shaders/particles/immersive** → threejs-webgl only.
5. **Ship gate** → ui-ux-pro-max UX validation + anti-slop rejection (+ threejs-webgl perf gate).
6. **Design verdict** → design-intelligence critique, then record the pattern and direction.
