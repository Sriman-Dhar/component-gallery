---
name: Command-driven navigation
description: A keyboard palette replaces menu depth as the primary way to reach anything in a dense product
domains: [navigation, interaction, information-architecture]
product_types: [saas, devtools, productivity, dashboard]
tags: [command-palette, keyboard, power-user, progressive-disclosure]
source: Linear, Raycast, Superhuman, Figma, VS Code
added: 2026-08-12
---

## Problem

Products with many actions face a bad trade: put everything in the navigation and it becomes
a wall, or bury things in menus and nobody finds them. Both punish the daily user, who
already knows what they want and just needs to get there.

## Mechanism

A single keystroke (usually `Cmd/Ctrl+K`) opens a fuzzy-search overlay listing every action,
object, and destination in the product. Results are ranked by recency and frequency, grouped
by kind, and each row shows its own keyboard shortcut — so the palette teaches shortcuts as
a side effect of being used. The visible chrome shrinks to only what a new user needs;
depth lives in the palette.

## Why it works

Recognition beats recall, but *search* beats both when the user already knows the target.
The palette collapses an arbitrarily deep navigation tree into one flat, typo-tolerant
interaction, so the cost of reaching any action becomes constant instead of proportional to
how buried it is. It also lets the visible UI stay calm without hiding capability.

## Visual characteristics

Centred overlay, roughly 560–640px wide, sitting above a dimmed backdrop. Single input at
the top with no label. Grouped results with quiet section headers, one highlighted row,
shortcut hints right-aligned in muted text. Opens and closes fast — 120–150ms — because any
slower and it stops feeling like a keystroke.

## Psychological effect

Makes a dense product feel fast and under control. Users describe products with a good
palette as "quick" even when the underlying operations are identical to a competitor's.
The visible shortcut hints create a gentle progression from clicking to typing.

## Best used when

Daily or weekly repeat use · more than roughly 20 distinct actions · a desktop-weighted
audience · users who will invest in learning the tool.

## Anti-patterns

A palette is not navigation for first-time or occasional users — if it is the *only* way to
reach something important, that thing is effectively hidden. It fails entirely on touch. And
a palette bolted onto a shallow product with twelve actions is cargo cult: the depth it
solves for doesn't exist.

## Adaptations

The underlying idea — search as the primary index instead of hierarchy — transfers well
beyond keyboard overlays: a persistent search field as the main navigation on a large
content site, a "jump to" affordance in a long admin form, or a voice equivalent on mobile.
The transferable principle is *flatten depth with search*, not *add Cmd+K*.
