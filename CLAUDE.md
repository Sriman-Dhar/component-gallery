# Sriman Gallery: instructions for Claude Code

You are working in a component gallery for the LofiStack 90 Day Build Challenge
(2026-10-01 to 2026-12-30). Each week you add components here. You have no memory of past
weeks: this file and the weekly prompt the user pastes are everything you know.

## What this repo is

Vite + React 18 + TypeScript + Tailwind v3 + react-router v6. A static single page app,
deployed on Vercel (`vercel.json` rewrites every path to `index.html`).

- `/` lists every component.
- `/components/<slug>` shows one component: live demo, code, and its final prompt.

## Challenge rules that decide points

1. Every component has its own direct link: `/components/<slug>`. The route comes for free
   from the folder, so the folder name IS the link. Choose it carefully.
2. Every component has a plain `Type` label, one of: button, form, card, modal, navbar,
   table, loader, section, chart, input. Types must differ across the set: no repeats.
   `npm run check` prints the count per type; a type already at 1 is a repeat.
3. Every component posts its final prompt. It lives in `meta.ts` as `prompt`.
   Missing or TODO prompt = the component does not count, and `npm run check` fails.
4. The weekly prompt file the user pastes is the source of truth for which components to
   build, their slugs, types and names. Do not invent extra components.

## Folder pattern

```
src/components/<slug>/
  meta.ts           export const meta: ComponentMeta = { slug, name, type, week, date, summary, prompt }
  <PascalName>.tsx  default export: the component (slug 'pricing-card' -> PricingCard.tsx)
  demo.tsx          optional default export: a demo wrapper with sample props/data.
                    If absent, the detail page renders the component with no props.
```

- Types live in `src/lib/types.ts`. The registry (`src/lib/registry.ts`) finds every folder
  with `import.meta.glob`; you never register anything by hand.
- Extra helper files are fine inside the folder. Keep every file under 300 lines; split first.
- `example-button` (week 0) is the scaffold placeholder and the test fixture. Leave it in place.
  Week 0 is not counted in the type totals.

## Commands

```
npm run new -- <slug> --type <label> --week <n> --name "<Name>"   # creates the folder from templates
npm run check      # validates every meta.ts, prints type counts, ends with OK
npm test           # vitest: registry, route, and render smoke for every component
npm run build      # tsc + vite build
```

## How to add one component

1. `npm run new -- <slug> --type <label> --week <n> --name "<Name>"`.
2. Build it. Add `demo.tsx` if it needs sample props or data.
3. Fill `summary` and paste the exact final prompt into `prompt` (a template string).
4. `npm run check`, `npm test`, `npm run build`. All three must pass. Fix, do not skip.
5. Commit that component alone: `feat(<slug>): <Name> (week N, <type>)`.
   Example: `feat(pricing-card): Pricing Card (week 2, card)`. One component = one commit.

## Design brief

The site's design brief is `docs/DESIGN-BRIEF-v3.md` ("The Living Orrery", 2026-10-02): one WebGL scene behind
the index (`src/shell/world/`), Archivo expanded display type, the Mrs Saint Delafield signature. It extends
`docs/DESIGN-BRIEF.md` (v2), which still holds wherever v3 does not override it.

## Quality bar

The gallery is judged against the best component work on the web, not against "it renders".

- Before building ANY component, invoke the design skills in `.claude/skills/`, starting with
  `lofistack-frontend-stack` (the pipeline and router) and `design-intelligence` (the creative
  brief). Follow the other skills they route to (design-taste-frontend, ui-ux-pro-max,
  design-system, ui-styling, brand, the gsap-* skills for motion, threejs-webgl for 3D).
- Those skills name MCP servers (shadcn MCP, 21st.dev Magic MCP). They are NOT available in
  Claude Code cloud. Skip those steps and say so in your summary. Never fake their output.
- No component libraries (no shadcn install, no MUI, no Chakra). Hand-built with Tailwind.
- Accessible by default: real buttons and labels, keyboard reachable, visible focus,
  respects `prefers-reduced-motion`.
- Do not change the gallery shell (`src/shell`, `src/pages`, `src/routes`, `src/styles`) unless the weekly prompt says so.

## Do not

- Do not delete or rename a shipped component folder: its link is already posted.
- Do not reuse a Type label that `npm run check` already counts.
- Do not add a git remote or change deploy settings.
