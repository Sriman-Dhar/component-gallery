---
name: Undo instead of confirm
description: Let the action happen immediately and offer a reversal, rather than interrupting everyone to prevent a rare mistake
domains: [interaction, component-states, motion]
product_types: [saas, productivity, email, mobile, ecommerce]
tags: [destructive-actions, optimistic-ui, toast, error-prevention, reversibility]
source: Gmail, Linear, Notion, iOS
added: 2026-08-12
---

## Problem

Confirmation dialogs tax the 99% of intentional actions to protect against the 1% of
accidental ones. Worse, they stop working: users learn to dismiss them reflexively, so the
dialog that was meant to prevent the mistake gets clicked through at exactly the moment it
matters.

## Mechanism

Perform the action immediately and optimistically. Surface a transient, non-blocking
notice — "Archived. Undo" — that persists for 5–10 seconds and is dismissible. Undo restores
the prior state exactly, including scroll position and selection. Server-side, the operation
is either deferred until the window closes or written as a soft delete that undo reverses.

## Why it works

It matches how people actually work: acting and correcting is faster than deliberating in
advance, and it keeps the user in flow. Because undo is genuinely rare, the cost of
supporting it falls on the system rather than on every user, every time. And unlike a
dialog, undo still works when the mistake was *not noticing* — the user sees the wrong
outcome and reverses it.

## Visual characteristics

Bottom or bottom-left toast, quiet rather than alarming, with the action verb in past tense
and a clearly clickable undo. Enters fast (~150ms), sits still, fades out. The affected row
often animates out with a short collapse so the change is legible rather than silent.

## Psychological effect

Lowers the felt stakes of using the product. Users explore more freely when they believe
mistakes are cheap, which materially increases how much of a product people ever try.

## Best used when

The action is reversible in principle · it happens often · a delay of a few seconds before
committing is acceptable · the user is likely to notice the outcome immediately.

## Anti-patterns

Not for genuinely irreversible operations — permanent deletion, payments, sending to
external recipients, publishing to the public. Those still deserve deliberate friction, and
the strongest version asks the user to type the name of the thing rather than click OK. Also
avoid where the outcome isn't visible: an undo toast for something happening off-screen will
expire unread.

## Adaptations

The same reversibility logic drives drafts and autosave, "restore from trash" over hard
delete, version history, and staged publishing. The transferable principle is *make the
common path frictionless and the recovery path reliable* — not *replace all dialogs with
toasts*.
