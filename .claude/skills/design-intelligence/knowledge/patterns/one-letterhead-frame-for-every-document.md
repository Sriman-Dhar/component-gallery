---
name: One letterhead frame for every document
description: All PDFs a module produces (invoice, payslip, statement) render inside a single letterhead component fed by an editable settings row, and the on-screen 'paper' preview uses the same numbers, so brand and figures cannot drift between screen and print
domains: [print, layout]
product_types: [finance, internal-tool, saas]
tags: [pdf, letterhead, consistency]
source: LofiHub Finance part 6
added: 2026-08-18
---
Mechanism: a Letterhead PDF component (logo, address block, rule, footer, corner accent) takes settings + children; each document is only its body table. The screen preview is a white 'paper' card styled to match. Problem: per-document templates drift and duplicate brand details. Why it works: one place to change the address, colour, footer; users trust that the PDF is what they saw. Breaks: documents needing landscape or multi-column layouts (give them their own frame explicitly). Transfer: any product that emits several branded documents.
