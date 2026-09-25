---
name: Pay-confirm modal with receipt waiver
description: Payment toggle opens a confirm modal: account, date, mandatory note, receipt files, or an explicit no-receipt waiver with reason that flags the record until a file lands; nothing writes until save
domains: [interaction, forms]
product_types: [finance, payroll, internal-tool]
tags: [confirmation, receipt, audit, idempotent]
source: LofiHub finance mockup v3
added: 2026-08-17
---
Mechanism: replace an instant toggle with a modal that makes the proof (note + receipt) the act of paying; escape hatch is a waiver that leaves a visible pending flag instead of blocking payday. Why it works: the cost of proof is paid at the moment memory is freshest; the flag keeps the debt visible. Breaks when: high-volume payments (needs prefill/reuse, not bulk).
