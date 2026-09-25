---
name: Pay-confirm as the only write path
description: A status toggle never writes; it opens a confirm dialog (account, date, mandatory note, receipts or an explicit waiver) whose save is the single idempotent write, so a payment can never be made by a stray click and always carries its evidence
domains: [forms, interaction]
product_types: [finance, internal-tool]
tags: [idempotent, confirm, receipts, audit]
source: LofiHub Finance part 3 (Hasnain A3)
added: 2026-08-18
---
Mechanism: the register row shows state; the only mutation is a modal whose Save calls an RPC guarded by a unique partial index (one live payment per line). Files upload as added so save is instant. Problem: money toggles get flipped by accident and lose their paper trail. Why it works: the decision moment collects the evidence, and the server refuses a second save loudly. Breaks: when a bulk action is genuinely needed (then design a bulk confirm, never a bulk toggle). Transfer: any irreversible status change (publish, approve, ship).
