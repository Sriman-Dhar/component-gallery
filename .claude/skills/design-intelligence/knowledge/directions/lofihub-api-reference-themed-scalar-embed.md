---
name: LofiHub API reference — themed Scalar embed
description: Third-party OpenAPI renderer (Scalar, MIT, pinned CDN) mapped 1:1 to the app's existing tokens so the docs read as a room of the product, with a 52px brand bar and the vendor's cloud upsells disabled
project: LofiHub
family: brand-locked app surface (violet)
shipped: 2026-08-27
tags: []
source: 
added: 2026-08-27
---
Worked: theme:'none' + the vendor's CSS variables filled from src/index.css tokens, both modes measured AA (dark worst 6.02:1, light worst 5.99:1). Traps: (1) html,body{height:100%} confines a sticky bar to one viewport height, so it unsticks after the first screen; use min-height. (2) Register the bar via --scalar-custom-header-height or the vendor's sticky sidebar hides under it. (3) The vendor toggles .dark-mode/.light-mode on <body> itself and persists localStorage.colorMode; do not add a second theme store. (4) showDeveloperTools:'never', agent:{disabled:true}, mcp:{disabled:true} remove the upsell chrome. Not a fresh aesthetic: brand-locked, so the violet family repeat is deliberate.
