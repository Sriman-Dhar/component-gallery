---
name: PARADOX OS ident, the core writes its name
description: 12s cyan particle core brand ident where the travelling light plane that crosses the sphere then lights the wordmark outward from its centre letter, 2D canvas additive sprites in Remotion
project: Paradox Console
family: dark cyan instrument futurism
shipped: 2026-09-09
tags: [remotion, motion-graphics, particles, brand-ident, canvas, fibonacci-sphere, additive]
source: core-design-ref.png plus stratum-machine-core-instrument
added: 2026-09-09
---
Direction B of three for the PARADOX OS 12 second ident, locked over Ignition (converge,
flash, type in) and Aperture (ring collapse plus camera push through a circular mask).

The transferable idea: when the brand mark IS a light source, do not animate the wordmark,
LIGHT it. The same gaussian light plane that sweeps through the particle volume keeps
travelling outward and the letters of PARADOX become visible only where it has reached,
spreading symmetrically outward from the centre letter. Nothing slides, fades in as a block,
or types. That turns two events glued together (object animates, then text animates) into
one system where every element on screen is explained by the single source.

What worked:
- Rendering path was a 2D canvas projection, not @remotion/three. Deterministic, no WebGL or
  angle flag risk, and 360 frames of 2600 points times 3 additive sprite layers encoded in
  36 seconds total. Pre-render one radial gradient sprite per layer to an offscreen canvas
  and blit with drawImage under globalCompositeOperation lighter, three full passes so the
  layers stack. Additive is order independent so depth sorting is unnecessary, but per
  particle alpha weighted by depth (0.34 back to 1.0 front) is what makes it read as a
  volume instead of a flat disc of dots.
- A raw fibonacci sphere produces visible moire spirals at 1920 wide. Adding tiny
  deterministic jitter (y +/- 0.015, theta +/- 0.06, shell thickness +/- 5 percent) and a per
  particle size multiplier 0.76 to 1.46 turns the lattice into organic grain that matches
  the reference image.
- Per particle landing flare: a gaussian on (frame - seatFrame)/8 applied to the bright
  layer makes the shell sparkle into existence during the gather instead of fading up as
  fog. Cheap and it is the difference between a beat and a dissolve.
- Bottom up stagger only works if you check which way the projection flips y. Screen down is
  world y negative, so heightBias must be ((y+1)/2), not (1-(y+1)/2). The first render had it
  inverted and the sphere formed top down.

Traps burned in:
- useLayoutEffect canvas drawing is safe in Remotion, it commits before paint, but every
  value must come from useCurrentFrame and the sprite canvases must be built once in a ref,
  not per frame.
- Do not place a hairline rule by eyeballing the wordmark y. First lockup put the rule
  through the middle of the letters at 838 when the 106px wordmark at y 744 ran to 855.
- @remotion/google-fonts loadFont with no options fires 96 network requests per family in
  the render. Harmless here but pass a weight subset on anything bigger.

Files: ~/Work/_probes/paradox-ident, composition ParadoxIdent, brief in docs/CREATIVE-BRIEF.md.

Round 2 correction, the single most transferable lesson from this build: a particle mass
reads as LIGHT only when neighbouring sprites overlap. The first pass had mid at 1.6 and
halo at 3.6 times the base sprite, which is mathematically the recipe but visually a precise
wireframe orb with faint moire rings. Pushing mid to 2.7 and halo to 4.8 so the soft
gradients bleed into each other, while leaving the bright layer at 0.7 on a tight falloff so
depth still reads, is what turned it into the chunky luminous body the reference shows. Two
supporting moves: double the angular jitter on the fibonacci seats (0.12 to 0.24 radians of
spread) and add a frame driven per point twinkle seeded from the index, applied to the mid
and bright layers but never to the halo so the underlying mass stays smooth. Rule of thumb:
sprite overlap makes the mass, jitter kills the moire, the crisp layer keeps the depth.
