---
name: Honest zero-state for phased rollouts
description: When a module ships in slices, panels whose data source is not live yet render real structure with real zeros plus one line saying which slice brings the numbers, never placeholder figures
domains: [content, layout]
product_types: [dashboard, saas, internal-tool]
tags: [empty-state, phased-rollout, trust]
source: LofiHub Finance part 1
added: 2026-08-18
---
Mechanism: the panel is the final component reading the final view/contract; the backing view returns 0 until the later migration replaces its body. Problem: fake numbers in a finance tool destroy trust and get screenshotted. Why it works: the user learns the layout early and the copy sets an expectation with a named cause. Breaks: when the zero could be mistaken for a real zero (add the note). Transfer: any staged rollout with a stable read contract.
