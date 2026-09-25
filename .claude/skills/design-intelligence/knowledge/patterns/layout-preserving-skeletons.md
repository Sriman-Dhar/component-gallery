---
name: Layout-preserving skeletons
description: Loading states shaped like the content that is coming, instead of a spinner that hides the page
domains: [interaction, motion, component-states]
product_types: [saas, dashboard, ecommerce, content, mobile]
tags: [loading, perceived-performance, layout-stability, skeleton]
source: Facebook, Linear, Vercel, YouTube
added: 2026-08-12
---

## Problem

A centred spinner erases the page while data loads, then the content slams in and shifts
everything. The user learns nothing during the wait, and the arrival is jarring — worse,
they may already be reaching for a control that moves out from under them.

## Mechanism

While loading, render the layout with neutral blocks matching the real content's shape and
position: a circle where the avatar goes, three lines of decreasing width where the
paragraph goes, a rectangle at the chart's exact dimensions. A slow shimmer or gentle
opacity pulse (1.5–2s) signals activity. When data arrives, the blocks are replaced in
place, so nothing moves.

## Why it works

Two separate effects. First, the wait *feels* shorter because the interface appears to be
partly there already — progress is visible rather than asserted. Second, and more
practically, reserving the space eliminates cumulative layout shift, which is both a real
usability problem and a measured performance penalty.

## Visual characteristics

Blocks in a single neutral one or two steps from the background — never dark grey on white,
which reads as content rather than absence. Radius matches the real elements. The shimmer
travels at a shallow angle, low contrast, and stops on `prefers-reduced-motion` where a
static block is perfectly adequate.

## Psychological effect

Converts an anxious blank wait into an anticipatory one. The user's eye pre-positions on
where the thing they want will appear, so they parse the content faster once it lands.

## Best used when

Load times of roughly 300ms to 3s · content whose shape is known in advance · lists, cards,
tables, profiles, dashboards.

## Anti-patterns

Under about 300ms a skeleton flashes and reads as jank — render nothing, or hold the
previous state. Over roughly 3–5s a skeleton starts lying about progress; use a real
progress indicator with an estimate. Skeletons for content of unpredictable shape are
misleading, since the placeholder promises a layout that may not arrive.

## Adaptations

The general principle — *reserve the space and show the shape of what's coming* — applies
beyond loading: optimistic rendering of a not-yet-saved row, a placeholder card while an
upload processes, or a ghost element during a drag showing where the item will land.
