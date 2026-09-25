---
name: Empty state as onboarding surface
description: The zero-data screen carries the product's teaching moment instead of apologising for having nothing
domains: [component-states, information-architecture, copy]
product_types: [saas, dashboard, productivity, mobile]
tags: [empty-state, first-run, onboarding, activation]
source: Notion, Linear, Stripe, Airtable, Height
added: 2026-08-12
---

## Problem

Every new account starts empty, so the empty state is the *first* thing every user sees —
and it is almost always designed last, ending up as a grey box reading "No data". The moment
with the highest leverage in the entire product gets the least design attention.

## Mechanism

Treat the empty state as a real screen with three jobs: say what belongs here, say why it is
worth having, and offer exactly one action that fills it. Where possible, show illustrative
or sample content in a visibly non-real style so the user can see the shape of a populated
screen before committing. Some products go further and seed a real starter record the user
can edit or delete.

## Why it works

An empty screen gives the user no model of what the product does, so they have to reason
about it abstractly — which is the moment most people leave. Showing the destination
converts an abstract decision ("should I set this up?") into a concrete one ("I want mine to
look like that"). Reducing the choice to one action removes the paralysis of an empty canvas.

## Visual characteristics

Composed, not centred-and-shrugging. Ample space, a short heading in ordinary sentence case,
one or two lines of body, a single primary action. Any illustration is small and specific to
what belongs here — not a generic person-with-a-magnifying-glass. Sample content is visually
distinguished by reduced opacity, dashed borders, or an explicit label.

## Psychological effect

Turns absence into invitation. It also sets expectations for density: a user who sees a
sample dashboard understands roughly how much they need to add before it becomes useful.

## Best used when

First-run screens · any list, table, board, or feed that can be empty · filtered views that
can return nothing — though note that "no results for this filter" is a *different* state
from "nothing exists yet", and giving them the same screen is a common and confusing mistake.

## Anti-patterns

Don't put an empty state where an error belongs — "nothing here" when the request actually
failed silently destroys trust. Don't offer three competing actions; the point is to remove
the choice. And don't ship sample content that can be mistaken for real, especially anywhere
numbers appear.

## Adaptations

The pattern generalises to any moment of absence: a search with no results (offer a broader
query), a notification centre that's clear (confirm it, don't apologise), a completed task
list (celebrate briefly rather than showing a void), a chart with one data point.
