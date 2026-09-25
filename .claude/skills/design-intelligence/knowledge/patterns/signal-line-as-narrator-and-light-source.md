---
name: Signal line as narrator and light source
description: One graphic element repeats in a fixed band across every slide, changing state to carry the argument, and doubles as the scene lighting so failure slides go literally dark
domains: [layout, color, motion]
product_types: [slides, social, marketing]
tags: [carousel, signature-system, dark-ui, svg, narrative]
source: original
added: 2026-08-25
---
## Mechanism
One graphic element (here a horizontal "signal line") appears in the same band on every slide
of a deck/carousel, and its STATE changes slide to slide to narrate the argument: whole,
broken, dark, dotted, doubled, whole again. The same element also acts as the scene's light
source, so slides where it is dead are literally darker and slides where it is whole glow.

## Problem it solves
Decks and carousels default to a hero-decorated first slide over an identical body template.
The signature stops propagating after slide 1 and the rest reads generic.

## Why it works
The reader tracks a single moving variable across slides instead of re-reading a static
motif. Because the element is also the lighting, the emotional temperature of each slide is
produced by the argument itself rather than applied on top of it. Nothing needs a caption.

## Where it breaks
Needs a linear argument with a real state change. A deck of parallel, unordered points has
no state to narrate, and the element becomes a meaningless stripe.

## Transfer
Any sequential surface: onboarding flows (a progress spine that frays where users drop),
pitch decks (a revenue line that dips at the problem slide), changelog pages, docs tutorials.
