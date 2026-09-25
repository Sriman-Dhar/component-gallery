---
name: Cinematic 3D centerpiece with orbiting glass UI
description: One photoreal 3D object (planet, statue, organ) is the hero under a single light story; the UI floats around it as one consistent glass recipe, type interleaves with the object's depth, all on a dark single-hue field
domains: [3d, hero, glassmorphism, dark-ui, motion]
product_types: [saas landing, museum/editorial site, health dashboard, ui kit]
tags: [pinterest, liquid-glass, webgl, r3f, cinematic]
source: 4 Pinterest refs picked by Sriman 2026-08-23 (Quantum, Sandhill Museum, HeartBloom v2, Nexora liquid glass)
added: 2026-08-23
---
## The mechanism

One photoreal 3D object is the hero — a planet, a classical statue, an anatomical heart —
and the interface floats around it as glass. Four reference pins (Sriman, 2026-08-23) share
the exact same recipe:

1. **Quantum** (SaaS landing): purple planet arc + floating obsidian rocks + glossy light
   ribbons; letterspaced display type; glass nav bar and pill CTA sitting *on* the scene.
2. **Museum of Ancient Art** (Sandhill Studio, motion): black statue backlit by a glowing
   neon ring; large serif title overlapping the object's z-depth; thin grid columns.
3. **HeartBloom v2** (health dashboard): anatomical heart rendered in a lush environment;
   UI cards (charts, schedule, alerts) float around it as frosted glass with soft shadows.
4. **Liquid glass UI kit**: the component vocabulary — chromatic glass pills, refraction,
   iridescent edge lighting, one glass recipe per screen (never two).

## The rules that make it work

- **One object, one light story.** A single dominant light source (ring glow, planet rim,
  bloom) that both the 3D object and the UI glass obey. Mixed lighting = instant fake.
- **Type interleaves with the object** (in front of some parts, behind others) — that
  z-overlap is what sells depth; flat type on top reads as a screenshot.
- **UI is glass, scene is matter.** Interface elements are transmissive/frosted; the 3D
  object is opaque and material-rich (obsidian, bronze, tissue). Keeps hierarchy legible.
- **Dark field, one hue family.** All four live on near-black with one saturated family
  (violet, blue, teal-pink) — the single-accent economy applied to 3D.
- **One glass recipe per screen** (blur radius, tint, edge highlight) — mixing recipes is
  the liquid-glass equivalent of material drift.

## Build paths (decide before promising)

- **Real-time**: R3F + transmission materials, bloom postprocessing, MeshTransmissionMaterial
  for liquid glass; planet/ring/particles are cheap; photoreal statue/organ is not.
- **Pre-rendered**: generate the centerpiece as image/video (Gemini/ChatGPT via Chrome, or
  user assets), composite with parallax + WebGL particles on top — the Sandhill approach.
- **Hybrid** is usually right: rendered centerpiece, real-time glass UI and motion.
