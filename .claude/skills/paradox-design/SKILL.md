---
name: paradox-design
description: Paradox OS playbook for design work of any size — pages, components, CSS tweaks, mockups, logos, banners, decks, charts, 3D, motion. Invoke BEFORE lofistack-frontend-stack; it is the process wrapper (brief → pipeline → build → measured verification → critique) and holds the traps that made past design work look templated. Not for SIPS/SBD (QA-only).
---

# Paradox design playbook — award-level, measured, never templated

**Standard.** Would this be shortlisted next to the best work in its category? Structure passing is not design: light, tonal ramp, type drama, texture and a signature idea carried through EVERY section. Same skeleton twice = template = reject.

## Process
1. **Route.** Invoke Skill `lofistack-frontend-stack`, find the surface row, invoke EVERY skill in it (tool calls, not mentions) and actually run `ui-ux-pro-max`'s search.py. State: "Skills invoked: X. Row requires: Y. Missing: Z." Fix Z before any code.
2. **Creative brief first** (design-intelligence Phase 0): audience, job of the surface, references studied, 3 distinct directions, one locked. No aesthetic before the brief.
3. **System before screens:** tokens (colour, type scale, spacing, motion), then components, then pages. Light mode and dark mode both real (`:root[data-theme=…]` specificity trap; `bg-ink/[x]` not `bg-white/[x]`).
4. **Build** with the code playbook's limits (files ≤300 lines, one component per file). GSAP for DOM motion, threejs-webgl for 3D; `prefers-reduced-motion` honoured.
5. **Verify by measuring, never by reasoning:** real browser (Chrome MCP or headless) → screenshots at 3 widths, computed contrast (composite alpha first; `oklab(… / a)` fools naive math), tab order, focus states, layout shift, FPS for motion. CSS reasoning is a hypothesis until measured.
6. **Critique** (design-intelligence closing phase) against the brief and the 7 traps in `memory/design-intelligence-skill.md`. Record any new pattern worth keeping.
7. **Close:** memory + index; reply ≤6 lines with what was measured.

## Traps
- Naming skills without invoking them (measured 2026-08-12). Loading = tool call.
- Picking an aesthetic before the brief exists; producing one plausible direction instead of three.
- AI-generated people in imagery (refused). Fake testimonials (refused).
- Contrast fails left "for later" (74 were parked once); fix or list with his call needed.
- Tokens that do not exist (`bg-background`). Check the token file.
- Motion that ships as a FILE (video, GIF, social still) built with GSAP, CSS or a screen recorder: invoke Skill `remotion-video` instead; GSAP and threejs-webgl own live pages, remotion-video owns rendered output.
- Mockup of a page inside an existing app with an invented shell or a new nav pattern (INC-030, 2026-09-07: fake sidebar + pill row cost a rebuild). Real shell, existing in-page nav, brief assumptions asked first.

## Definition of done
Row fully invoked · brief locked · tokens + components + pages · measured verification with numbers · critique done · both themes · no oversized files · memory updated.
