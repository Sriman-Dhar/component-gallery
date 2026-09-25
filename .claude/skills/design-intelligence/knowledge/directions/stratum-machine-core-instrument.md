---
name: Stratum — machine core instrument
description: Futuristic IT-firm landing: 2600-point fibonacci particle core with counter-rotating shell as hero centerpiece, headline interleaving its limb, deep blue-black + single electric cyan, Sora + JetBrains Mono, glass nav, holeless 3+3 bento, real Simple Icons stack wall
project: design-lab
family: dark cyan instrument futurism
shipped: 2026-08-23
tags: [it-firm, webgl, particles, bento, simpleicons, sora]
source: 
added: 2026-08-23
---
What worked: fibonacci point-sphere + dim counter-rotating shell reads unmistakably futuristic at trivial GPU cost; frustum-relative placement (halfW fraction) keeps the centerpiece at 72% viewport at any width/zoom. Traps burned into this build: a CANVAS is a replaced element - position:absolute+inset:0 does NOT stretch it, it keeps intrinsic size and you silently see only the left half of the render (must set width/height:100%); in no-loop modes any resize wipes the GL buffer, so size() must end with a render; navigating to same-URL+hash does not refetch - cache-bust when screenshot-verifying edits; bento with span-2 cells after a span-3 row auto-places into holes - keep row spans summing to the column count. File: ~/Work/design-lab/stratum.html
