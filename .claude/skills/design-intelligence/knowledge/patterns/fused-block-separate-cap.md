---
name: Fused block, separate cap
description: Draw shared layers as one object with strata and the variable layer as a separate part on top, instead of N similar rectangles
domains: [layout, information-design]
product_types: [saas, agency, marketing-site]
tags: [diagram, explanatory, object-count, configurator]
source: lofistack-variant /the-stack
added: 2026-08-13
---
## Mechanism
When a product's claim is "these parts are shared, this one is yours", draw the
shared parts as ONE object with internal strata, and the variable part as a
separate piece resting on it in a different material. Do not draw N+1 similar
shapes.

## Problem it solves
Diagrams of layered platforms default to N stacked rectangles. That form says
"N separate things", which actively contradicts a "these are one shared
foundation" argument, and no amount of restyling fixes it because the count is
the message. Five restyles of five plates were rejected before the count
changed.

## Why it works
Object count is read before labels are. A viewer counts shapes pre-attentively,
so a single fused body with engraved grooves is perceived as one thing with
internal structure, while five plates are perceived as five things. Material
difference (fill, gloss, its own cast shadow) marks the variable part faster
than any caption.

## Where it breaks
Wrong when the layers genuinely ARE swappable or independently purchasable —
then separate objects are truthful. Also wrong when the strata carry long text:
horizontal rows inside a block start reading as a table, which is the residual
weakness even in the shipped version.

## Transfer
Any "platform + configuration" pitch: a shared API with per-tenant themes, a
common chassis with model-specific trim, a standard contract with a custom
schedule. Same move, different material.

## Verification that carried the idea
The claim "the foundation never moves" was made literally true and then MEASURED:
a probe clicked all 8 industries and diffed the block's bounding box. It caught a
real 2px growth (an appearing status chip narrowed the caption column and
rewrapped the text). Reserving the chip's cell fixed it. A claim of stillness
should be asserted by a test, not by eye.
