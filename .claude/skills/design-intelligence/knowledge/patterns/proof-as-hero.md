---
name: Proof-as-hero
description: The hero visual is the artefact the buyer fears getting wrong, rendered correctly and verifiably, instead of a tilted dashboard screenshot
domains: [layout, typography, motion, data-visualization]
product_types: [fintech, saas, b2b, compliance, infrastructure]
tags: [trust, hero, numeric, evidence, anti-slop]
source: Mercury, Ramp, Stripe; live research on fintech trust patterns 2026-08-12
added: 2026-08-12
---
## Problem

Product landing heroes for tools that handle money default to a screenshot of the dashboard,
tilted, floating over a gradient. It shows that a UI exists but says nothing about whether the
tool is trustworthy — which is the only question a burned buyer is actually asking.

## Mechanism

Make the hero visual the artefact the buyer is afraid of getting wrong, rendered correctly and
at rest. For a payments tool that is a reconciling payment run; for a scheduling tool a week
with no conflicts; for a compliance tool an audit trail with no gaps. Build it from real
markup, not an image: right-aligned tabular figures, muted repeated units, a totals row, and a
final strip that states the resolved condition ("Balanced to the cent, variance 0.00"). The
figures must actually reconcile — sum the rows and check them against the stated total.

## Why it works

It converts an abstract trust claim into a verifiable one in the same glance. The buyer can
audit the hero. A tilted screenshot asks for belief; a correct ledger offers evidence, and
evidence is what a skeptical operational buyer converts on.

## Visual characteristics

Flat, upright, unrotated, at full opacity — no perspective transform, no glow, no device
frame. Instrument-tight density inside the card against generous space around the copy. One
accent, spent on the resolved-condition strip so the eye lands there last.

## Psychological effect

Precision reads as competence. Getting the arithmetic right in a decorative element signals a
team that gets arithmetic right everywhere, which is exactly the inference the buyer is
trying to make.

## Best used when

Trust-first B2B — fintech, payroll, compliance, infrastructure, health records · a buyer who
has been burned before · a category where the AI-default hero is already saturated.

## Anti-patterns

Do not use it where the artefact is boring or unintelligible to the audience — a consumer app
gains nothing from showing a database row. Never invent precise-looking figures and present
them as real; label sample data as sample. And do not animate individual source figures
through intermediate values: for a product selling accuracy, showing a number as briefly
wrong contradicts the pitch, however good the count looks. Count the total only, because a
total counting up reads as summation rather than as the data being wrong.

## Adaptations

The general move is *make the hero visual the proof rather than the product*. A security tool
shows a clean scan; a testing tool shows a green suite with real timings; a logistics tool
shows an on-time delivery table. Ask what the buyer is afraid of, then show that fear resolved.
