# CREATIVE BRIEF v2 — Sriman's Gallery (component gallery for the 90 day build challenge)

Updated 2026-10-01 (index showcase pass: lit type, lit fraction, rail scene, lit stages, atmosphere; then the live
orrery; then the editorial pass: the two tone hero and the rename to "Sriman's Gallery"; then the owner's final face
ruling: Shantell Sans replaces Zodiak and the dev font lab is gone).

v1 ("specimen sheet", warm paper, quiet motion) was rejected on 2026-09-25: the gallery itself must be UI/UX rich and
animated, a showcase piece, not a catalogue. v2 replaces it entirely. Nothing from v1's palette or type survives.

**Design Read:** Reading this as a *live, dark showcase of 30 UI components built over 90 days* for *a reviewer who
decides in 40 seconds and a developer who wants to lift one component*, whose single job is *open a link, see the
component alive, read the prompt that made it, take the code*, in a *confident, cinematic, technical* register, at
*studio* complexity: one strong WebGL scene (the rail and the orrery it feeds), everything else crisp DOM.

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
- Structure: max-w 1280, 12-col grid. Index: HERO (left, 7 cols: the editorial statement, the lit roman name over the italic amber pace line, then the lit fraction,
  an oversized lit numerator over a ghosted outline "/30" and a micro rail of 30 ticks with the shipped ones lit;
  right, 5 cols: the ORRERY, the live 3D object, its foot leaning into the rail below; phones: the orrery scales
  into its own row under the fraction, just above the rail; full width below: the particle light rail scene) → BRIDGE (a rail station heading,
  "Shipped so far", the detail pages' SectionHeading, so index and detail share one system) → TILE GRID (asymmetric: the newest component is a 2x wide feature tile, the rest 3-up on desktop,
  2-up tablet, 1-up phone; each tile is a live mini stage of the component, not a screenshot) → FOOTER (repo link,
  challenge line). Detail: BACK ("All components", arrow + hairline, 44px, first focusable thing on the page) → HEADER
  RAIL (№ oversized in the display face with a warm bloom behind it, name, stamp chips: Type, a lit Week chip whose
  node is the rail node, date; compressed light rail with the node blooming) → STAGE (full width, min 520px, lit
  corner marks, light/dark stage switch, width presets 375 / 768 / full showing only presets narrower than the
  stage, the whole group hidden when only Full fits) → THE ASK (rail-station heading, prompt, copy) → THE CODE
  (rail-station heading, source with a scanning highlight line on reveal, copy) → PREV / NEXT (tiles, tilt on
  hover). Alongside, the page's own SCROLL RAIL: from lg a slim vertical line fixed in the left gutter that fills
  with amber as the page scrolls, one node per section (Stage, The ask, The code, Previous and next) placed where
  the fill meets that section, lighting as it is reached and jumping there on click; below lg a 2px amber progress
  line under the header. 404: unlit rail with a flicker →
  "Nothing shipped here." → link home. No tabs hide Code or Prompt.
- **Typography is superseded by v3 (2026-10-02, owner ruling, see `docs/DESIGN-BRIEF-v3.md`):** display = Archivo
  expanded (wdth 125, weights 600 to 800, tracking -0.02 to -0.035em) on every display surface; signature = Mrs Saint
  Delafield, the name "Sriman" once per route at most; Geist + Geist Mono stay. Shantell Sans is retired and no
  longer loads. The paragraph below is kept as history only.
- (Superseded) Typography (updated 2026-10-01, fourth pass). His words: "get rid of the font gallery
  and select a font on your own; requirment is to have one that like handwritten style or something but readble
  easily". The DISPLAY face is Shantell Sans (Google Fonts, OFL): drawn from handwriting, so every big moment reads
  as made by a person, but engineered for reading (open counters, generous x-height, steady rhythm), and its italic
  is a true italic with more lean and flow, which carries the hero's second voice. It replaces Zodiak (the serif of
  the third pass). The dev-only font lab (FontLab.tsx, fontLabFaces.ts, its Clash and Fontshare loads and its
  sessionStorage key) is deleted; nothing but Shantell Sans, Geist and Geist Mono loads. Loaded as
  `Shantell+Sans:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700`: Google serves one variable file per style and
  subset, so that is two latin files.
  Weights: big surfaces 600, quiet surfaces 500; nothing on the display face uses 400. Shantell is rounder and
  wider than a serif and its spacing is already loose, so tracking is eased off from the serif values.
  THE TWO TONE HERO (the signature): line 1 "Sriman's Gallery" in the roman at 600, text colour, tracking -0.02em,
  leading 1.04, 46 to 76px (13vw below lg, 5.8vw from lg: one line on desktop, two on phones); then the pace line
  as the accent, "thirty components in thirteen weeks." (lower case: one sentence in two voices), in the ITALIC at
  500, 28 to 54px (9vw / 4.2vw), leading 1.12, tracking -0.01em, text-wrap balance, painted with the amber ramp
  (--accent-line-top to --accent-line-bottom, background-clip text) and swept once by a sheen (--accent-sheen) that
  parks off the right edge. The roman line keeps the letter light (heat follows the pointer). Descender rule
  (hard): Shantell's descenders reach 0.26em under the baseline (its descent is 0.32em); the accent's ink box pads
  0.16em under and 0.1em at the ends (box-decoration-break: clone), RiseText's word masks pad 0.12em under and 0.06em
  at the ends. Measured: 25.8px clear under the deepest descender at 1280 (17.2px at 375), 0 pixels lost with
  clipping on versus off for the name, the accent, the 404 line and the section headings at 320, 375 and 1280.
  Per surface: header brand roman 600 at 21px (-0.015em); lit numerator roman 600 at 96/136; ghost "/30" italic 500
  outline; detail № roman 600 at 72/112; detail name roman 600 at 40/60 (-0.015 to -0.02em); section headings italic
  500 at 30px in text colour (the hero's italic voice, quieter); tile names roman 500 at 23px; "Next: Week N" italic
  500 in text-2; 404 "Nothing shipped" roman 600 with "here." in the amber italic ink at 600. The apostrophe is set
  as U+2019 on screen (typeset() in src/lib/site.ts); titles, meta and accessible names keep the plain string.
  Geist stays for body and UI (400/500/600), Geist Mono for metadata, prompt and code. A metric fallback face
  ('Shantell Fallback': Arial and its italic at size-adjust 115% for weights up to 549, Arial Bold and its italic at
  109.5% from 550, ascent 102% / descent 32% / gap 0 of Shantell divided by each size-adjust, measured from the
  Shantell files over the site's display strings) sits in the stack so the swap barely shifts layout. Arial, not a
  comic face, so a failed load still reads plain.
  Tokens: --font-display / --font-sans / --font-mono in tokens.css, Tailwind font-display / font-sans / font-mono.
  Never Inter, Fraunces, Instrument Serif or Comic Sans.
- Color (semantic tokens, both frame themes real, dark is the default and the flagship):
  Dark: bg #0B0B0E · surface #131318 · surface-2 #1A1A21 · line #26262E · text #F3F3F6 · text-2 #9C9CAB ·
  accent ramp: glow #FFC38A (core) · accent #FF8A2A (body) · accent-deep #8A3E0A (shadow) · rim #7C93C9 (cool,
  cursor + today only) · stage-light #F6F6F8 with grid #E2E2E8 · stage-dark #121216 with grid #24242C.
  Light: bg #F4F4F7 · surface #FFFFFF · surface-2 #ECECF1 · line #D9D9E1 · text #121216 · text-2 #5D5D6B ·
  accent #D9600A (AA on light) · glow #FF8A2A · accent-deep #7A3708 · rim #4A66A8. Every text pair AA measured;
  accent text on dark bg only where ratio ≥ 4.5 (#FF8A2A on #0B0B0E is 8.3, fine).
  Hero accent line (2026-10-01): dark ramp #FFC38A to #FF8A2A (12.57 and 8.35 on bg), sheen #FFECD6 (17.05);
  light ramp #AD4A05 to #7A3708 (5.09 and 8.05), sheen #8A3E0A (6.9), a darkening sweep, since amber-500 on the
  light bg (2.1) would dip below large-text AA mid sweep. No purple anywhere.
- Light (the craft floor): a fixed radial key light top-left in accent-deep at 18% over the bg, a cool rim
  bottom-right at 8%, three ultra-soft beams falling from the top of the page (glow at 5%, blurred, drifting over
  11 to 17s, lighter on phones), a fixed vignette pulling the eye to the center (black at 55% dark, 4% light), and
  a pointer light in two layers: a tight warm core (240px, glow) that leads at 0.25s and the wide halo (600px,
  accent 6%) that trails at 0.9s, so the light has inertia. Type and tiles catch the light: the name's letters warm
  toward --color-heat as the pointer light nears them (colour only; a glow would be clipped by the rise masks);
  each tile stage is lit from above, a beam that lands as a pool on its floor behind the component and leans after
  the pointer (--spot-x). New tokens: --color-heat, --numeral-top/--numeral-bottom, --shaft-alpha, --vignette-alpha,
  --spot-alpha, --spot-blend (screen on dark, multiply on light); all showcase classes live in
  src/styles/showcase.css. Tonal depth
  through the accent ramp: glow for nodes and the pulse core, accent for body, deep for shadows and tints.
- Shape & depth: radius 12 on tiles and stage, 8 on controls, pill on the theme switch. Tinted shadows only
  (accent-deep at 25% on dark). Hairlines in line. Glass only on the sticky header (backdrop blur + 1px inner top
  highlight), nowhere else.
- Texture: grain layer (fixed, pointer-events none, 5%, feTurbulence SVG data URI) plus a faint 1px grid on the
  stage. Tiles get a light sheen (a moving linear highlight that follows the pointer angle).

**Motion posture (GSAP for DOM, three.js via @react-three/fiber for the rail; every tween under gsap.matchMedia,
reduced motion = instant final states, particles frozen as a composed still)**
- Hero, one load sequence: the name letters rise in with a 20ms stagger, then a light sweeps across them once
  (0.75s in); the micro rail ticks draw up; the count runs up with its lamp dim (0.9s, expo.out), then ignites
  (flicker 0.3/1/0.45/1/0.75/1, settle) as its bloom swells once and the lit ticks glow; the particle rail
  assembles from scattered points into the line (1.2s) and then breathes; the pulse runs the rail every 4s with an
  afterglow trail behind its head, and the week numbers under the rail warm as it passes them. WHY: orientation,
  progress read before a word, and the one memorable moment.
- Tiles: ScrollTrigger batch reveal (y 24, opacity, 40ms stagger, once) as a stage being lit: the tile rises,
  its stage light flickers on (--spot-on), then the component appears in it. The next week's slot is an unlit
  stage (grid at 55%) with one node breathing (1.8s sine yoyo). Hover tilt (max 6deg, quickTo, damped) +
  sheen + border glow in accent at 40%; press scale 0.98. WHY: the work is the content; hover says "alive".
- Route change: the leaving view fades and slides 12px, the entering view rises; 320ms total. WHY: continuity.
- Detail: the № rises and its bloom swells once and settles; the name letters rise in 20ms apart (the hero's
  language); the stamp chips and summary follow; the node blooms on the rail (scale + glow); the stage slides up
  24px into place and the light traces its four corner marks once (top left, top right, bottom right, bottom left),
  flares and settles dim; each section heading's node blooms and its hairline draws out from it once on scroll-in;
  the code block reveals with a scanning highlight that runs top to bottom once. The scroll rail is driven by
  scroll position only (ScrollTrigger, no per-frame React state), never by time. WHY: the rail stops being a header
  ornament and becomes the page's spine; every section is a station on it. Width preset
  change tweens the inner frame width (280ms, power3.inOut); stage theme switch crossfades (200ms).
- Theme toggle: circular clip-path wipe from the toggle's position (450ms). WHY: state change with spatial cause.
- Copy: label morphs to "Copied" (scale pop). 404: the rail flickers twice then stays dim.
- Still on purpose: body text, the prompt once revealed, the code once revealed, the footer.

**The orrery (hero, right; added 2026-10-01 after a direction pass: particle earth, orrery, particle forge):** the
30 components as an orrery, the gallery itself as an object. Three nearly coplanar rings (small inclinations, one
shared plane seen 0.56 rad from its edge, so it reads as an orrery, never an atom logo) made of the rail's filament
bent into orbits; ten component slots ride each ring in ship order, inner ring first; a shipped slot is a dense
lit cluster in the amber ramp, a future slot a small cool speck in rim; a breathing core with a near-white hot
point at its center. Motion: the system turns once every 40s, each ring's slots travel at their own rate, points
within 130px lean toward the pointer, a horizontal drag spins it (touch keeps vertical scroll) and a flick keeps
spinning then eases back to the base rate (~0.9s time constant). It assembles from scatter like the rail, and
once per pulse cycle the rail's pulse leaving the rail's end rises into it as a band of light sweeping up from its
foot (railPulse, a shared mutable head value, no React state). Depth: perspective (focal 2.2), point size
attenuates with perspective squared, near points brighter and far points falling into shade. Decorative:
aria-hidden, no focus; the fraction says the same in words. It beat the particle earth (a "global" metaphor that
says nothing about 30 components) and a particle forge (energetic but abstract): the orrery shows 2 of 30 lit
without reading. Poster (no WebGL, reduced motion, before the canvas is live): the same projection in SVG, dotted
rings with the near half bright and the far half faint, lit slots blooming, the core glowing around a hot point.
Atmosphere: a warm radial bloom behind it with a faint cool rim, scaled by --bloom-alpha so it steps down on the
light frame.

**WebGL budget (threejs-webgl QA gate applies):** the hero's two canvases share 7000 points: the rail ≤ 3600
(in practice ~3100, the 1184px frame at 2.6 points per pixel), the orrery ≤ 3400 (7.5 per pixel of its box
width; filament 60% drawn by ring circumference, slot clusters 24% with shipped slots weighted 6 to 1, core 11%,
dust the rest). Both use one shared crisp sprite (a hard disc with a sub-pixel edge and a faint tight halo, so
points read as rendered light, not soft dust). DPR is the device's up to 2, and an adaptive step (1s fps windows,
two slow windows under 55fps step down by 0.25) never goes below 1.5; the orrery canvas is antialiased. The rail
itself, one draw call: filament
56%, week node clusters 24%, a reflection of the clusters mirrored on the floor below the line 13% (fading with
depth, bending toward the pointer's mirror image), dust drifting behind at parallax against the pointer (the rest);
reflection and dust are borrowed from the budget, never added to it. The poster's line and nodes dim to 40% under
the particles; its week labels stay at full contrast. Frameloop demand until the
assemble finishes then "always" only while the hero is in view (IntersectionObserver pauses it), additive
sprites in the accent ramp, no post-processing, no textures over 256px, disposal on unmount, context-lost guard,
a CSS poster (the rail as a plain SVG line with lit nodes) when WebGL is unavailable or reduced motion is on.
Target 60fps desktop, 30fps mid phone.

**The memorable moment:** the light rail and the orrery it feeds. A reviewer opening the tenth submission sees the
same rail, one more node lit and the pulse passing through it and rising into the orrery, where one more slot of
the thirty burns, and understands the 90 days without reading a word.

**Section choreography**
- Index: hero (lit name, lit fraction with its micro rail, the orrery, particle rail scene) → bridge heading (station node
  blooms, hairline draws, once) → tile grid (lit stages, ignition reveal) → footer (still). The rail is the hero
  and recurs in the micro rail and the station node; the tiles are the work; nothing else competes. Reduced
  motion: every piece in its settled, lit state (numeral lit, ticks lit, beams still, poster rail, poster
  orrery, stages lit).
- Detail: back link (still) → header rail (№ bloom + letter rise + lit chips + compressed rail, node bloom) →
  stage (slide in, corner trace) → the ask (station heading, fade) → the code (station heading, scan reveal) →
  prev/next tiles; the scroll rail runs beside all of it. Code, prompt, headings, corners and bloom are still after
  their one reveal. Reduced motion: every one of them renders in its settled state; the scroll rail still tracks
  position (it is a reading of scroll, not an animation).
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
