---
name: Status colour steps chosen for text-on-own-tint
description: Pick each semantic status token so text on its own 10-15% tint passes AA; fixes every chip and alert at once instead of per component
domains: [color, accessibility]
product_types: [saas, dashboard]
tags: [tokens, contrast, light-mode, chips]
source: internal design system, 2026-08-28
added: 2026-08-28
---
**Mechanism:** A semantic status colour (danger/warn/success) is almost always rendered as tinted text on a 10-15% tint of itself. Pick the token step so that text-on-own-tint passes 4.5:1, then every chip, alert, and ghost button inherits the pass. In a light theme that means the 700 step (red-700 #b91c1c measured 5.0:1 on a 15% tint over white; red-600 #dc2626 measured 3.84-3.9:1).

**Problem it solves:** Dozens of components share the pattern `text-X bg-X/15`; fixing one chip with a className override leaves the other 59 failing and fights stylesheet order.

**Why it works:** The tint barely moves luminance of the background (white -> ~#f4dddd), so the text colour alone decides the ratio; one step darker buys ~1.1 ratio points.

**Where it breaks:** Dark themes go the other way (lighter step, e.g. red-400) because the tint sits on near-black. Solid fills with white text want the same darker step, so no conflict there.

**Transfer:** Any token-driven UI: audit the semantic ramp per theme against its own tint, not against the page background. Example ramp: light warn #b45309, success #15803d, danger #b91c1c, all 700-step.
