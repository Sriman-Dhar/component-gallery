---
name: Audit trail in plain words, ids never shown
description: An audit log is rendered through a pure mapping (action × table × diff) into what/on/change sentences with names resolved client-side, so non-technical people read it and sensitive rows are tinted rather than hidden in place
domains: [content, tables]
product_types: [internal-tool, finance, saas]
tags: [audit, plain-language, privacy]
source: LofiHub Finance part 4 (Hasnain A4)
added: 2026-08-18
---
Mechanism: a definer read fn scopes rows by permission and strips sensitive fields; a tested pure function turns each row into three short strings; unknown rows fall back to 'changed <thing>' rather than raw JSON. Problem: raw audit tables are unreadable and leak ids/amounts. Why it works: the sentence is written from the reader's side ('marked paid', 'left someone out of funding'). Breaks: when a table's semantics change without updating the mapping (keep the fallback honest). Transfer: any activity feed built on a generic change log.
