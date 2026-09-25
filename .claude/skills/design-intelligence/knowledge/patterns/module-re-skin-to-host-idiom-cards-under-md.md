---
name: Module re-skin to host idiom, cards under md
description: Re-skin a dense ported module to the host product's own idiom: real buttons (one primary per row), icon+word status chips, type up a step, tables become cards below md
domains: [layout, components, responsive]
product_types: [saas, dashboard, admin]
tags: [buttons, status-chip, responsive-table, consistency, finance]
source: internal finance module, 2026-08-19
added: 2026-08-19
---
**Mechanism:** A dense "instrument" module inside a product whose other screens use a friendlier idiom (icon tabs, pill buttons, chips) gets re-skinned to that idiom rather than to a new aesthetic: actions become real buttons with a single primary per row, statuses become icon+word chips, the type scale moves up one step, and wide tables become stacked cards below `md` while the table stays above.
**Problem it solves:** Users read text-link actions ("Mark paid / Hold") as hyperlinks, not as the thing to press; a module that looks different from its siblings feels like a different product and has to be re-learned.
**Why it works:** Consistency carries learned affordances across screens; a solid button + icon is recognised in the first glance; cards on phones keep every column readable without horizontal scroll.
**Where it breaks:** Genuinely high-frequency operator tools where density is the feature (trading, ops consoles); a primary button per row becomes a wall of colour when every row needs the same action (make it secondary and promote a bulk action instead).
**Transfer:** Any admin/finance/ops module bolted into a consumer-ish SaaS; any "mockup-fidelity port" that was never reconciled with the host product's idiom.
**Probe trick:** When the automation browser cannot resize the viewport, inject a same-origin iframe at 390px into the live page; it renders the authenticated app at phone width for real measurement.
