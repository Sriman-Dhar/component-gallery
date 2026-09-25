---
name: Helion hero — cinematic violet planetrise
description: Quantum-pin recreation proven real-time: shader planet with fresnel rim + atmosphere shell behind tracked Space Grotesk wordmark, obsidian rock foreground canvas over the type layer, one glass recipe, GSAP ignition entrance
project: design-lab PoC
family: cinematic violet space
shipped: 2026-08-23
tags: [3d, webgl, planet, glass, helion, pinterest-ref]
source: 
added: 2026-08-23
---
What worked: two-canvas z-interleave (bg planet/stars, fg rocks over DOM type) sells depth cheaply; radial scrim behind hero copy fixed rim-glow contrast failure caught in critique. Traps: never gate UI visibility on CSS awaiting JS (occluded windows freeze rAF, GSAP ticker never ticks - build fail-visible, hide via gsap.set at animation time); Chrome-extension verification runs occluded, so verify settled states by seeking gsap.globalTimeline. File: ~/Work/design-lab/helion-hero.html
