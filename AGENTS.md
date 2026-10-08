# Agent guide — read this first (keep sessions small)

Purpose: author/maintain project documentation in this docs-first workspace **without reading bulk kit or generated files**.
Humans read `README.md` / `START_HERE.md`. Agents follow the rules below.

## 1. What to read for a task (and nothing else)
1. The task pack: `.project-docs/agent-packs/<name>.md` (rules + compact templates + allowed relations, ~1–3k tokens).
   Create it if missing: `cd tools && npm run agent:pack -- --types feature,requirement,business-rule,api,test-case --out author-core`
2. The source files of the ONE unit you are documenting (`cd tools && npm run source:map -- --entity <CODE>`; list with sizes before opening).
3. Bounded graph context only when needed: `npm run context -- --entity <CODE> --max-depth 1 --max-entities 6`
4. Existing docs of that unit only (`docs/**`, excluding the paths in section 2).

## 2. Never open (derived, bulk, or rebuilt by tools)
- `kit/**` → use the task pack instead
- `docs/_generated/**`, `docs/history/**`
- `.project-docs/indexes/**`, `.project-docs/site/**`, `.project-docs/exports/**`, `.project-docs/imports/**`, `.project-docs/cache/**`
- `**/node_modules/**`, `**/dist/**`, lock files, images in `mockups/` unless the task is mockup analysis

## 3. Query, don't read
`npm run search -- --text "<words>" --limit 10` · `npm run query -- --expr "type=requirement AND status=approved"` · `npm run source:map -- --entity <CODE>` · `npm run verification:status`

## 4. Per-unit loop (one Feature per session)
1. Pack + unit source → write docs (omit `uid`/`revision`; keep frontmatter lists on one line).
2. `cd tools && npm run entity:identity-backfill -- --apply && npm run docs:validate && npm run verification:check`
3. Fix only what validation reports; do not re-read finished docs "to be sure".
4. Commit, then stop. Start a fresh session for the next unit.

## 5. Budget
Before starting run `npm run brownfield:budget`. If a unit's real usage exceeds 1.5× its estimate, stop and report instead of continuing.
Do not write detail the spec level does not require (default `lightweight` for brownfield; escalate only via `spec:recommend`).
