---
name: Persistent morphing centerpiece
description: One fixed WebGL particle system lives behind the entire scroll and morphs into a section-specific formation as each section takes the viewport, so the hero's signature IS the site's spine instead of a hero decoration
domains: [3d, scroll, motion, hero, consistency]
product_types: [saas landing, agency site, product site]
tags: [particles, formations, scroll-choreography, signature-system]
source: Stratum v2 rebuild after whole-site-consistency feedback, 2026-08-23
added: 2026-08-23
---
## Mechanism
2600 particles in a fixed full-viewport canvas. Each section declares data-scene; formations
(Float32Array targets) are prebuilt per scene and rebuilt on resize from the camera frustum.
Every frame each particle lerps toward the active section's formation (chase ~0.045), so
scrolling melts one shape into the next. Opacity and point size are formation properties too,
which lets a section be near-silent.

Stratum's arc: sphere (the core, whole) -> four clusters (decomposed, one per service module)
-> diagonal stream (the process pipeline) -> ordered lattice (boring tech = order) -> flat
data band behind the metrics -> 7% opacity dust behind the quote (deliberate stillness) ->
small dense sphere above the CTA (the core, compressed).

## Why it works
The signature stops being a hero decoration: the same object explains each section's message
by changing shape, so the page reads as one continuous system. Stillness becomes a designed
beat instead of a gap.

## Rules
- The active section = last data-scene whose top is above scrollY + 0.8*viewport (a section
  must DOMINATE the view before it owns the core). Short sections can never own it: give a
  stillness beat min-height ~90dvh.
- DOM must echo the formations (mono system labels, corner ticks, node diamonds, hairline
  lattice) or the canvas reads as a screensaver behind an unrelated page.
- No-loop modes (reduced-motion, static verification): jump chase to 1 and re-render on
  scroll + resize, since rAF may never fire.
- scroll-behavior:smooth + occluded window = scrollTo() never arrives; use behavior:'instant'
  when driving verification.

## Where it breaks
Content-heavy sites where a live background fights readability; low-end mobile (drop N,
cap DPR); pages with fewer than ~4 sections (not enough beats to justify the system).
