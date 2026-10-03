# CREATIVE BRIEF v3 — Sriman's Gallery: "The Living Orrery"

Written 2026-10-02. Goal: the strongest 3D design and animation of any gallery in the challenge, built from our own
ideas only. This brief EXTENDS v2 (docs/DESIGN-BRIEF.md);
everything v2 locks that is not overridden here stays: dark studio, amber key + cool rim lighting, Geist body +
Geist Mono, two tone hero (now sans + signature), light rail signature, both themes real, AA, reduced motion honoured.

**Design Read:** a live, cinematic showcase of 30 UI components built over 90 days, for a reviewer deciding in 40
seconds whether this is the best gallery in the cohort and a developer who wants one component's code, whose single
job is "be amazed in the first second, then open a component and take it", in a confident, cinematic, technical
register, at studio complexity, now with ONE world-class WebGL scene that is the spine of the whole site.

**Bar to beat:** a 3D scene that lives through the whole scroll, reacts to the user, and carries meaning (shipped vs
future), not a single decorative hero canvas.

## Directions considered
- A. **The Living Orrery (CHOSEN).** Our existing 30-slot orrery grows from a side ornament into a full-viewport,
  persistent WebGL world behind the entire index. One fixed canvas, one scene, one rAF. Scroll drives a camera flight
  and particle morphs: the scene IS the narrative. Beats the others because it is ours already (continuity, not a
  restart), it encodes real data (30 slots, shipped lit), and it scales to week 13 for free.
- B. Studio pedestals: each component on a lit 3D plinth in a showroom. Rejected: heavy GLB pipeline, reads as a
  product configurator, and DOM components rendered in 3D lose crispness and accessibility.
- C. Glyph forge: particles cast big type numbers per section. Not chosen as the spine, but its strongest idea is
  GRAFTED: on scroll into the grid, the particle swarm condenses into the oversized component numbers.

## The memorable moment
You land in darkness, a sun ignites, 30 orbital bodies spin up into three rings (the 2 shipped ones blazing amber,
28 future ones cool and faint), you drag and the whole system turns with inertia, and as you scroll the camera
dives THROUGH the rings, the particles stream down and straighten into the 90-day light rail, then break apart and
re-form as glowing halos behind the component tiles. One continuous world, never a cut.

## Section choreography (index), the signature in every section
1. HERO (100vh, pinned ~120vh): full-bleed orrery fills the viewport behind the two tone hero type (DOM, crisp, over
   the canvas, left aligned). Bloom on the sun and shipped bodies, depth of field softening the far ring, faint dust
   nebula with parallax. Pointer = a gravity well that bends nearby particles; click/tap = a shockwave ripple through
   the rings; drag = spin with inertia (keep). Ignition intro on load (sun flare, rings draw on, bodies arrive) under
   2.2s, skippable by any input.
2. DIVE (scroll-scrubbed, ScrollTrigger is the single scroll source; the scene reads it): camera pushes through the
   ring plane; the fraction "2 / 30" and micro rail sit in the DOM and the orbit particles peel off and stream down.
3. RAIL: the stream straightens into the existing 90-day light rail (13 week nodes, shipped weeks lit). The rail is
   now a formation of the SAME particle system, not a second canvas.
4. SHIPPED GRID: particles break into per-tile halos (a glowing contour orbiting behind each live tile) and the
   oversized component numbers form as particle glyphs behind their tiles for a beat, then settle to a quiet glow.
   Tiles keep 3D tilt + sheen and gain a hover light that the particle halo answers.
5. FOOTER: the system calms into a distant orrery seen from far away (deliberate stillness, slow drift only).

Detail page: the same scene in "close orbit" mode: this component's body fills the top behind the header (its
orbit ring sweeping behind the № glyph), compressed and cheap; stage area has no WebGL behind it (component must be
crisp and measurable). 404: the orrery with all bodies dark, the sun guttering.

## Visual language deltas from v2
- Light: a real lighting story in the shader: sun = HDR core > bloom; bodies have a fresnel rim from the key light;
  cool rim on the far side. Tonal ramp inside amber (white-hot core, amber body, deep ember shadow). Fog/depth fade.
- Texture: keep grain; add a very faint nebula noise in the scene background (shader, not an image).
- TYPE (2026-10-02: sleek sans + signature, replacing Shantell Sans):
  - Display = **Archivo** expanded (Google Fonts variable, `Archivo:wdth,wght@62..125,100..900`, use wdth 125 for
    display, weights 600 to 800, tracking -0.02 to -0.035em, uppercase allowed for the pace statement). Sleek, wide,
    sharp; it replaces Shantell Sans on EVERY display surface (hero, fraction, numbers, headings, tiles, 404).
  - Signature = **Mrs Saint Delafield** (Google Fonts script), used ONCE per route at most: the name "Sriman" as a
    handwritten signature in amber with a write-on reveal (clip/mask sweep left to right, ~1.2s, eased; static under
    reduced motion), sized so it reads clearly (>= 64px desktop). Nowhere else.
  - Body Geist + Geist Mono stay. Remove every Shantell Sans load and reference (grep 0).
  - Never use any rejected display face: Geist (as display), Bricolage Grotesque, Clash Display, Zodiak, Shantell Sans.

## Tech + performance (non-negotiable)
- One `<Canvas>` for the whole index (fixed, behind DOM), R3F + drei + @react-three/postprocessing (Bloom, DoF or a
  cheap custom depth fade, Vignette, Noise off if grain exists). GPU particle morph via a position-target texture or
  attribute lerp in the vertex shader; no per-particle JS per frame.
- Single rAF (R3F's). Pause when tab hidden and when the canvas is offscreen. Adaptive DPR [1, 2] with a 55 fps floor
  (PerformanceMonitor). Low tier: fewer particles, no DoF. Respect the perf rules: one rAF, pause offscreen, adaptive DPR, no live full-page blur or blend.
- Targets on a real GPU (headed Chrome): index >= 55 fps during the hero and the dive at 1440x900 DPR 2; detail page
  >= 58 fps; 4x CPU throttle stays >= 30 fps; JS for the 3D layer lazy-loaded, the DOM paints first.
- Reduced motion: no flight, no ignition; the composed most beautiful still of the orrery, rail and halos.
  No WebGL: the existing posters, upgraded to match.
- DOM text never inside WebGL. All controls keyboard reachable, focus rings stay, 44px touch targets.
- Mobile (390): same story, fewer particles, the orrery framed above the type, dive shorter; 0px overflow.

## Explicitly rejected
- Spinning earth / globe . Generic starfield wallpaper. A second competing canvas.
- 3D for decoration only: every formation encodes something real (slots, weeks, shipped components).
