---
name: Contextual controls
description: Actions appear next to the thing they act on, at the moment they become relevant, instead of living in a permanent toolbar
domains: [interaction, navigation, component-states]
product_types: [productivity, saas, editor, canvas, content]
tags: [progressive-disclosure, selection, toolbar, density, discoverability]
source: Figma, Notion, Google Docs, Linear, Framer
added: 2026-08-12
---

## Problem

A permanent toolbar has to hold every action any user might ever need, so it grows until it
is both intimidating to newcomers and slow for experts, who must travel to the top of the
screen and back for each operation. Meanwhile most of those actions are irrelevant to
whatever is currently selected.

## Mechanism

Show actions where and when they apply. Selecting text raises a small floating toolbar with
only the formatting actions valid for that selection. Hovering a row reveals its row-level
actions in the trailing space that was previously empty. Selecting an object on a canvas
populates a properties panel with only that object's properties. The chrome is quiet at rest
and precise on demand.

## Why it works

It reduces the number of visible choices to those that are currently valid, which shortens
decision time and removes the mental filtering step. It also shortens physical distance —
controls appear near the cursor, where the user is already looking. And it makes the resting
interface calm, which is what lets a dense product feel simple.

## Visual characteristics

Small floating surface, elevated one step above the content, appearing within about 100ms of
the triggering state and positioned to avoid covering the selection. Icon-led with tooltips.
Row-level actions typically fade in on hover in reserved trailing space, so nothing reflows.

## Psychological effect

The product feels responsive and attentive — as if it understood what you were doing. It
also flattens the learning curve, since the user only ever meets the actions relevant to what
they are touching.

## Best used when

Object-rich surfaces — editors, canvases, tables, boards · frequent repeat use · a desktop or
tablet pointer, or a well-designed long-press equivalent on touch.

## Anti-patterns

Discoverability is the cost: an action that only ever appears on hover is invisible to
someone who hasn't hovered, and invisible entirely on touch. Anything essential needs a
permanent path too — a menu, a shortcut, or a command palette. Reserve the space the hover
controls will occupy, or the layout jumps on every hover.

## Adaptations

The principle — *reveal capability in proportion to context* — drives inline editing,
right-click menus, slash commands in a text field, and quick actions on a notification. The
question is always: what does the user's current selection tell me about what they want next?
