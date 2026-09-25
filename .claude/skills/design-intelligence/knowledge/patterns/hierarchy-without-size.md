---
name: Hierarchy without size
description: Building type hierarchy from weight, colour, spacing and position so the scale can stay small and coherent
domains: [typography, layout, hierarchy]
product_types: [saas, editorial, dashboard, portfolio, content]
tags: [type-scale, weight, contrast, restraint, editorial]
source: Stripe docs, Linear, Vercel, Swiss editorial design, book typography
added: 2026-08-12
---

## Problem

The reflex for making something more important is to make it bigger. Applied repeatedly you
end up with eight or ten type sizes, none of which relate to each other, and a page where
everything shouts — which is indistinguishable from a page where nothing does.

## Mechanism

Fix a small scale — often four or five sizes for an entire product — then build distinction
from the other available axes: weight (400 vs 500 vs 600), colour (full-contrast vs muted
vs subtle), letter-spacing, space above versus below, and position within the grid. A
section heading may be the same size as body text and still read as a heading because it is
semibold, full contrast, and carries twice the space above it that it does below.

## Why it works

Proximity and contrast are stronger grouping signals than size, and they don't consume
layout space. Space above versus below is particularly powerful: it tells the eye what the
heading *belongs to*, which size alone cannot express. Keeping the scale small also makes
the system easier to hold consistent, so the whole product reads as one author.

## Visual characteristics

Fewer sizes than expected, and unusually large jumps between the ones that exist. Body text
at a comfortable measure of 45–75 characters. Muted greys doing real hierarchical work
rather than acting as decoration. Generous asymmetric vertical rhythm — space above a
heading roughly double the space below it.

## Psychological effect

Reads as considered and calm. Small-scale systems feel more expensive than large-scale ones,
which is why editorial and luxury work consistently uses less size contrast than mainstream
marketing does.

## Best used when

Content-dense surfaces · documentation · dashboards · editorial layouts · any product that
must stay coherent across many screens built by different people.

## Anti-patterns

Not for a marketing hero, where a single large display moment is doing legitimate work.
Weight-based hierarchy also needs a typeface with real weights available — faking it with
synthetic bold degrades badly. And muted colour as a hierarchy tool must still clear
contrast minimums; "subtle" is not a licence to ship 3:1 body text.

## Adaptations

The same principle applies outside type: hierarchy among UI elements can come from spacing
and alignment rather than from boxes, borders and shadows. Ask what the smallest available
signal is that would make the distinction clear — the answer is rarely "make it bigger".
