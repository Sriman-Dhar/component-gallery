# CREATIVE BRIEF v2 — Sriman Gallery (component gallery for the 90 day build challenge)

v1 ("specimen sheet", warm paper, quiet motion) was rejected on 2026-09-25: the gallery itself must be UI/UX rich and
animated, a showcase piece, not a catalogue. v2 replaces it entirely. Nothing from v1's palette or type survives.

**Design Read:** Reading this as a *live, dark showcase of 30 UI components built over 90 days* for *a reviewer who
decides in 40 seconds and a developer who wants to lift one component*, whose single job is *open a link, see the
component alive, read the prompt that made it, take the code*, in a *confident, cinematic, technical* register, at
*studio* complexity: one strong WebGL moment, everything else crisp DOM.

**Direction: "Light rail studio."** A near-black studio with a real lighting story: one warm key light (amber) and a
faint cool rim (blue-grey). The signature is the 90-DAY LIGHT RAIL: a horizontal line of light spanning
2026-10-01 to 2026-12-30 with 13 tick nodes; shipped weeks are lit nodes, a pulse of light travels the rail every
few seconds, and in the hero the rail is made of WebGL particles that drift, breathe and bend toward the pointer.
Every route carries the rail: full and particle-lit on the index, compressed with this component's node blooming on
the detail page, unlit and flickering on the 404. Components live on live tiles that tilt toward the pointer with a
moving light sheen, and the whole page reveals itself in choreographed steps as it scrolls.
It beat "neon control room" (cyan/magenta HUD lines, scanlines: generic and close to our recent cyan family) and
"editorial specimen" (v1, rejected as flat).

**Borrowed from:** Linear's homepage (one light source, restraint in colour, motion that explains hierarchy);
Vercel's product pages (dark studio, grid texture, crisp DOM type over a canvas moment); Apple product pages
(scroll choreography that reveals one idea per step); award-site particle heroes (a field that reacts to the
pointer but never fights the text).

**Visual language**
- Structure: max-w 1280, 12-col grid. Index: HERO (left: name + count moment; full width below: the particle
  light rail) → TILE GRID (asymmetric: the newest component is a 2x wide feature tile, the rest 3-up on desktop,
  2-up tablet, 1-up phone; each tile is a live mini stage of the component, not a screenshot) → FOOTER (repo link,
  challenge line). Detail: HEADER RAIL (№ oversized, name, type stamp, week, date; compressed light rail with the
  node blooming) → STAGE (full width, min 520px, light/dark stage switch, width presets 375 / 768 / full, the
  component slides in) → THE ASK (prompt, mono, lines revealed in a stagger, copy) → THE CODE (source with a
  scanning highlight line on reveal, copy) → PREV / NEXT (tiles, tilt on hover). 404: unlit rail with a flicker →
  "Nothing shipped here." → link home. No tabs hide Code or Prompt.
- Typography: Geist (display 600 tight, body 400/500) + Geist Mono (metadata, prompt, code). Scale 12 / 14 / 16 /
  20 / 28 / 44 / 72 / 112. Oversized moments: the count on the index at 112 (counts up on load), the № on detail at
  72. Google Fonts <link> with display=swap; Inter is not used.
- Color (semantic tokens, both frame themes real, dark is the default and the flagship):
  Dark: bg #0B0B0E · surface #131318 · surface-2 #1A1A21 · line #26262E · text #F3F3F6 · text-2 #9C9CAB ·
  accent ramp: glow #FFC38A (core) · accent #FF8A2A (body) · accent-deep #8A3E0A (shadow) · rim #7C93C9 (cool,
  cursor + today only) · stage-light #F6F6F8 with grid #E2E2E8 · stage-dark #121216 with grid #24242C.
  Light: bg #F4F4F7 · surface #FFFFFF · surface-2 #ECECF1 · line #D9D9E1 · text #121216 · text-2 #5D5D6B ·
  accent #D9600A (AA on light) · glow #FF8A2A · accent-deep #7A3708 · rim #4A66A8. Every text pair AA measured;
  accent text on dark bg only where ratio ≥ 4.5 (#FF8A2A on #0B0B0E is 8.3, fine).
- Light (the craft floor): a fixed radial key light top-left in accent-deep at 18% over the bg, a cool rim
  bottom-right at 8%, a pointer-following soft light (radial 600px, accent at 6%) on the frame only. Tonal depth
  through the accent ramp: glow for nodes and the pulse core, accent for body, deep for shadows and tints.
- Shape & depth: radius 12 on tiles and stage, 8 on controls, pill on the theme switch. Tinted shadows only
  (accent-deep at 25% on dark). Hairlines in line. Glass only on the sticky header (backdrop blur + 1px inner top
  highlight), nowhere else.
- Texture: grain layer (fixed, pointer-events none, 5%, feTurbulence SVG data URI) plus a faint 1px grid on the
  stage. Tiles get a light sheen (a moving linear highlight that follows the pointer angle).

**Motion posture (GSAP for DOM, three.js via @react-three/fiber for the rail; every tween under gsap.matchMedia,
reduced motion = instant final states, particles frozen as a composed still)**
- Hero: the count counts up (0.9s, expo.out); the name letters rise in with a 20ms stagger; the particle rail
  assembles from scattered points into the line (1.2s) and then breathes; the pulse runs along the rail every 4s.
  WHY: orientation and the one memorable moment.
- Tiles: ScrollTrigger batch reveal (y 24, opacity, 40ms stagger, once); hover tilt (max 6deg, quickTo, damped) +
  sheen + border glow in accent at 40%; press scale 0.98. WHY: the work is the content; hover says "alive".
- Route change: the leaving view fades and slides 12px, the entering view rises; 320ms total. WHY: continuity.
- Detail: the node blooms on the rail (scale + glow), the stage slides up 24px into place, prompt lines stagger
  in (18ms each), the code block reveals with a scanning highlight that runs top to bottom once. Width preset
  change tweens the inner frame width (280ms, power3.inOut); stage theme switch crossfades (200ms).
- Theme toggle: circular clip-path wipe from the toggle's position (450ms). WHY: state change with spatial cause.
- Copy: label morphs to "Copied" (scale pop). 404: the rail flickers twice then stays dim.
- Still on purpose: body text, the prompt once revealed, the code once revealed, the footer.

**WebGL budget (threejs-webgl QA gate applies):** ≤ 4000 points, dpr [1, 1.5], frameloop demand until the
assemble finishes then "always" only while the hero is in view (IntersectionObserver pauses it), additive
sprites in the accent ramp, no post-processing, no textures over 256px, disposal on unmount, context-lost guard,
a CSS poster (the rail as a plain SVG line with lit nodes) when WebGL is unavailable or reduced motion is on.
Target 60fps desktop, 30fps mid phone.

**The memorable moment:** the light rail. A reviewer opening the tenth submission sees the same rail, one more
node lit and the pulse passing through it, and understands the 90 days without reading a word.

**Section choreography**
- Index: hero (name, count moment, particle rail) → tile grid (asymmetric, live tiles, batch reveal) → footer
  (still). The rail is the hero; the tiles are the work; nothing else competes.
- Detail: header rail (№ + name + stamp + compressed rail, node bloom) → stage (slide in) → the ask (stagger) →
  the code (scan reveal) → prev/next tiles. Code and prompt are still after their reveal.
- 404: unlit flickering rail → message → link.

**Non-negotiables**
- WCAG AA contrast on every text pair in both frame themes, measured, not reasoned. Focus ring 2px accent on every
  control and link. Keyboard path through tiles, controls, copy buttons, prev/next.
- Every route is a direct link. A crashing component demo shows a plain message inside its tile or stage.
- Type stamp uses the challenge labels exactly (button, form, card, modal, navbar, table, loader, section, chart,
  input). The prompt is always visible on the detail page.
- Files ≤300 lines, one component per file, tokens in `src/styles/tokens.css` read through Tailwind CSS
  variables, no raw hex in .tsx, no bg-white/bg-black utilities, no em or en dashes in any visible string.
- No purple, no violet, no cyan neon, no glassmorphism beyond the header, no emoji, no scroll cues, no eyebrows,
  no section numbering labels, no fake screenshots (tiles render the real component).

**Explicitly rejected**
- v1 warm paper + serif specimen sheet (rejected by the owner as flat).
- Neon control room (cyan/magenta HUD, scanlines): generic, repeats our recent family.
- Card grid of static screenshots with hover glow: tiles must be live components.
- Preview/Code tabs; centered hero with three feature cards; purple gradients.
