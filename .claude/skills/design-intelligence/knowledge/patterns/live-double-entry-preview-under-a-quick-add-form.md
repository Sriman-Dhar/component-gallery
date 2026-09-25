---
name: Live double-entry preview under a quick-add form
description: A money-entry form shows the exact Dr/Cr legs it will post as the user types, including system-written lines (exchange difference), so a non-accountant sees the bookkeeping consequence before saving
domains: [forms, content]
product_types: [finance, internal-tool, saas]
tags: [journal, preview, trust, plain-language]
source: LofiHub Finance part 2
added: 2026-08-18
---
Mechanism: a pure client function mirrors the server's posting maths and renders one mono line 'Label Dr X · Account Cr X'; the server re-derives and is authoritative. Problem: double-entry feels opaque; users fear posting. Why it works: the consequence is visible at the moment of decision, in the same words the journal will use. Breaks: if the client mirror drifts from the server (keep both under tests, keep the server the authority). Transfer: any form whose save has non-obvious downstream effects (permissions, billing).
