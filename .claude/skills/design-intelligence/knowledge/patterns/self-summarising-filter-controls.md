---
name: Self-summarising filter controls
description: Each filter renders its own picked values as removable chips, so the control is the summary and no separate applied-filters strip is needed
domains: [interaction, component-states, information-architecture]
product_types: [saas, dashboard, productivity, admin]
tags: [filters, faceted-search, chips, progressive-disclosure, density]
source: LofiHub Reports task search; Linear, Height
added: 2026-08-13
---
## Problem

A filter surface with five or six criteria has two jobs that fight each other: offer every
criterion, and let the user see at a glance which ones are currently narrowing the list. The
usual answers each fail one half. A row of selects reading "All / All / All" shows the
criteria but hides the state, because a select set to its default looks identical to one the
user deliberately chose. A separate "applied filters" chip strip above the results shows the
state but duplicates it, so the same fact is now rendered twice and can disagree.

## Mechanism

Let each control hold its own chips. A multi-value filter renders the picked values as
removable chips directly under its own label, with the add-control collapsed to a single
"Anyone" select beneath them. The filter is therefore its own summary: empty means inactive,
chips mean active, and each chip's X removes exactly one value without opening anything. A
single "Clear all filters" link appears only when at least one criterion is live.

## Why it works

State and control occupy the same place, so there is nothing to keep in sync and nothing to
scan twice. Removal is where the eye already is, which is the shortest possible path for the
most common correction. And the resting interface stays quiet: an unused filter is one line
of label plus one collapsed select, so six criteria do not read as a wall.

## Where it breaks

Needs horizontal room to wrap into rows; below roughly 400px it degrades to one criterion per
row, which is usable but long. Also wrong when the filter set is large enough that the
controls themselves need progressive disclosure, where a "+ Add filter" menu that spawns
criteria on demand beats showing all of them.

## Transfer

Any faceted search: a log viewer filtering by level, service and time; a CRM filtering deals
by owner, stage and close date; an asset library filtering by type, tag and uploader.
