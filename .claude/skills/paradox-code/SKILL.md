---
name: paradox-code
description: Paradox OS playbook for building software — features, fixes, refactors, migrations, edge functions, deploys on any project we build (LofiHub, portals, WealthOS, Compenso, Paradox Console, portfolio, games). Invoke BEFORE writing code; it holds the expert-developer process, the hard limits, the verification ladder, the traps we have hit, and the definition of done. Not for SIPS/SBD client code (QA-only, match their patterns).
---

# Paradox code playbook — build like a state-of-the-art senior engineer

**Standard.** The codebase reads as if one expert wrote all of it: small files, one responsibility each, strict layering, centralized types, tests where there is logic, migrations versioned, every change reversible, and nothing shipped on belief. Judge the result against the best production code you know, not against "it works".

## Process

0. **Understand before touching.** Read the actual code paths involved and trace each value to where it is consumed or rendered. Never patch from the symptom.
1. **Design pass (any non-trivial task, before code).** 5-10 lines: file layout · where the logic lives (service/data layer, not UI) · data flow · DB change + rollback · what could break elsewhere (grep the callers). Superpowers: `brainstorming` for new features, `writing-plans` for multi-step work.
2. **Tests first where there is logic** (`superpowers:test-driven-development`): failing test → minimal code → green → refactor. UI-only work: a browser smoke script or measured check instead.
3. **Implement in small, named commits.** Refactor-as-you-touch: an oversized or sloppy file you open gets fixed in the same pass. Extract modals, tables, tabs, hooks as they appear. Delegating any of it goes through paradox-dispatch: a `code-edit`/`build` brief needs `--truth` (the real code or runtime that proves the goal, not the brief's own spec) and `--units`; read the PRE-CHECK before launching, and at `dispatch log` a PASS needs `--spot "<claim>|<what you re-derived from the truth>"` with every unit in `--done`/`--not-done`.
4. **Verify, in this order:** `tsc` 0 errors → lint → tests → runtime (browser that measures for UI, real request for API, bounded SELECT for DB) → security pass (RLS, grants, input bounds, secrets) → performance sanity (no N+1, bounded queries) → OUTCOME: after every external write (DB, migration, deploy, push, send) re-read the resulting state and compare with the expected state; a 200 proves only the call (Stop gate G5). Tag each claim [CONFIRMED]/[LIKELY]/[UNCERTAIN]/[UNKNOWN]/[FAILED].
5. **Hostile self-review** (`superpowers:requesting-code-review` or `/code-review`): read the diff as the reviewer who wants to reject it. Fix what they would find.
6. **Ship per the project's own flow** (in memory). Byte-verify the deployed asset against local `dist/`. DB: prove DDL rollback-wrapped on prod first, then apply as a numbered migration in the repo.
7. **Close:** memory detail + index line, task tracker entry (LofiHub: LofiStack › LofiHub project), reply with `Verified:` / `Not verified:` / `Memory:`.

## Hard limits (a violation is a defect, fixed in the same pass)
- ≤300 lines soft / 400 hard per file. No god-files, no god-components (>15 useState = smell).
- UI never calls the backend/DB raw; thin service per domain. Types in one place.
- Every DB read bounded; counts `head: true`; RLS on every table, root-of-trust = server-side role.
- No dead code, no duplication, no `any` escapes, no commented-out blocks.
- Match the surrounding idiom, naming and comment density.
- Git from day one (flag loudly if a project lacks it). Correct account per project; ask before new remotes/pushes.

## Traps we have hit (check the memory file of the project for more)
- Two competing `text-*` utilities resolve by stylesheet order: use a real variant, not a className override.
- `revoke … from public` does not drop Supabase's explicit `authenticated`/`anon` grants; name each role.
- `bg-background` was never a token; verify tokens exist before using them.
- Contrast math on `oklab(… / a)` alpha values is wrong unless composited first.
- Edge function deploys must include EVERY file, not only the changed one.
- Server-vs-browser clock comparisons produce phantom overdue/expired states; compare on the DB clock.
- Big SQL function edits: asserted surgical patch of `pg_get_functiondef`, never a retype.
- JWT "issued at future" 401s come from clock skew, not auth config.

## Definition of done
Builds clean (tsc + lint 0) · tests/verification pass with output shown · no file over limit · layering intact · types centralized · no dead code · deployed asset byte-verified · memory + tracker updated · reply states exactly what was and was not verified.
