---
name: One pinned moment
description: Spending the entire scroll-choreography budget on a single pinned sequence instead of animating every section
domains: [motion, layout, narrative]
product_types: [landing, portfolio, product-launch, agency, ecommerce]
tags: [scrolltrigger, pinning, pacing, restraint, narrative]
source: Apple product pages, Awwwards case studies, Stripe Sessions
added: 2026-08-12
---

## Problem

Once scroll animation is available, it gets applied to everything: fade-up on every element,
parallax on every image, a pinned section per feature. The page becomes slow to scan, and
because every section moves, no movement means anything. Motion applied uniformly is
identical to no motion, except that it costs performance and patience.

## Mechanism

Choose exactly one section per page to carry a real scroll-driven sequence — a pinned
wrapper where scroll position scrubs a transformation: a product rotating, a diagram
assembling, a horizontal pan, a stack of cards compressing. That section is pinned at
`top top` and scrubbed. Every other section gets either a single restrained entrance or
nothing at all. The pinned moment sits where the page's argument turns, typically just after
the problem is stated and before the proof.

## Why it works

Contrast is what makes motion legible. One moving section in a still page is an event; ten
moving sections are wallpaper. Pinning also converts scroll — which users perform
automatically — into a pacing control, so the sequence is revealed at the user's own rate
rather than on a timer they don't control.

## Visual characteristics

The pinned section usually occupies full viewport height and holds for roughly one to two
screens of scroll. Movement is scrubbed, not eased on a timeline, so it tracks the finger or
wheel exactly. Surrounding sections are notably calm, which is what makes the moment land.

## Psychological effect

Produces the single thing a user describes to someone else afterwards. It also communicates
craft budget: a page with one beautifully executed sequence reads as more considered than a
page with six adequate ones.

## Best used when

One-visit surfaces — landings, launches, portfolios, case studies · where there is a genuine
sequence to reveal, such as a process, a transformation, or a comparison over time.

## Anti-patterns

Never on a surface people return to and need to scan — pinning a section a daily user must
scroll past is hostile. It requires a real narrative: pinning a static list and fading items
in is scroll-jacking with nothing to show. And it needs a genuine reduced-motion fallback
that is beautiful as a still frame, not just a disabled animation.

## Adaptations

The budget principle transfers to any expensive technique: one WebGL moment, one custom
cursor context, one page transition, one sound. Ask which single moment earns the cost, and
make everything else quiet enough for it to register.
