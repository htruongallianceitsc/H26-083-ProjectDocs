# Documentation Toolchain v5.15

Requires Node.js 20+. The runtime uses only Node.js standard-library modules.

## Full QA

```bash
npm ci
npm run qa
```

The QA pipeline validates workspace layout, registries, source bases, source workspace, source intelligence, progressive specs, documentation, local indexes, Doctor, freshness, generated docs/site, and E2E regression.

## Project Documentation Bundle transfer (v5.15)

```bash
# v5.15+ source project
npm run docs:export

# v5.14-or-earlier source (run from the v5.15 tools directory)
npm run docs:export -- --source ../../OldProject

# optional integrity check
npm run docs:bundle:inspect -- --file ../.project-docs/exports/ProjectDocsExport.zip

# target project
npm run docs:import -- --file ../ProjectDocsExport.zip
```

Use `docs:import -- --dry-run` to preview and `--on-conflict replace` only after explicit conflict review. The importer maps canonical typed entities to the target starter's current layout and runs validation/reindex/sync/build by default.

## Workspace layout

```bash
npm run layout:check
npm run layout:migrate
npm run layout:migrate -- --apply
```

`layout:migrate` previews by default. v5.6 resolves canonical paths from `starter-kit.json.workspaceLayout`; legacy v5.5 root names remain accepted as migration aliases by the common path resolver.

## Entity model hardening

```bash
npm run entity:identity-status
npm run entity:identity-backfill
npm run entity:identity-backfill -- --apply
npm run entity:transition -- --entity FEAT-AUTH-LOGIN --to in_progress
```

`identity-backfill` is dry-run unless `--apply` is supplied. `entity:transition` enforces configured lifecycle transitions.

## Source workspace

```bash
npm run source:list
npm run source:validate
npm run source:recommend -- --type web --stack reactjs
npm run source:init -- --code APP-WEB --profile react-spa --variant production
npm run source:adopt -- --code APP-WEB --profile react-spa --root frontend
npm run source:check
npm run source:status
npm run source:upgrade-check -- --app APP-WEB
```

## Brownfield adoption and reverse engineering

```bash
npm run brownfield:inventory -- --app APP-WEB
npm run brownfield:candidates -- --app APP-WEB
npm run brownfield:status
npm run brownfield:review -- --candidate CAND-... --decision accepted --reviewer "Reviewer"
npm run brownfield:promote -- --candidate CAND-... --reviewer "Reviewer"
npm run brownfield:reconcile -- --app APP-WEB
npm run gate:baseline -- --app APP-WEB
npm run brownfield:baseline -- --app APP-WEB --actor "Team"
npm run brownfield:refactor-plan -- --app APP-WEB
```

Inventory/candidates/reconciliation/refactor plans are derived runtime evidence. Candidate promotion is review-gated. `brownfield:refactor-plan` never moves source; use a reviewed WorkPlan for physical normalization.

## Source intelligence and Git impact

```bash
npm run source:scan
npm run source:map -- --path apps/web/src/features/auth/Login.tsx
npm run source:map -- --entity FEAT-AUTH-LOGIN
npm run git:status
npm run git:impact
npm run git:impact -- --commit HEAD
npm run git:impact -- --from v1.0.0 --to HEAD
```

Source indexes are disposable. Mapping evidence is retained in the index so humans and agents can inspect confidence and reason.

## Local knowledge engine

```bash
npm run knowledge:reindex
npm run search -- --text "reset password"
npm run search -- --text withdrawal --type api
npm run query -- --expr "type=bug AND status!=closed"
npm run query -- --expr "type=test-case" --related-to FEAT-AUTH-LOGIN --max-depth 2
npm run context -- --entity FEAT-AUTH-LOGIN
npm run view:list
npm run view:run -- --view open-work-items
npm run doctor
npm run doctor -- --fix
```

## Progressive specification

```bash
npm run spec:status
npm run spec:check -- --feature FEAT-...
npm run spec:recommend -- --feature FEAT-...
npm run spec:promote -- --feature FEAT-... --to standard
npm run spec:promote -- --feature FEAT-... --to standard --apply
```

## Request / Ready / WorkPlan / Task

```bash
npm run gate:ready -- --feature FEAT-...
npm run plan:scaffold -- --feature FEAT-...
npm run plan:author-complete -- --id WP-... --actor "Author"
npm run plan:submit -- --id WP-...
npm run plan:approve -- --id WP-... --reviewer "Reviewer"
npm run plan:materialize -- --id WP-... --owner "Engineering"
npm run gate:done -- --feature FEAT-...
```

## Freshness / impact / history

```bash
npm run doc:check -- --entity FEAT-...
npm run doc:reconcile -- --entity FEAT-... --reviewer "Reviewer"
npm run impact -- --entity REQ-...
npm run audit:init -- --actor "Team"
npm run changeset:scan -- --actor "Team" --reason "..." --related FEAT-...
npm run baseline:create -- --name UAT-1 --actor "PM"
npm run baseline:compare -- --name UAT-1
```

## Registry / reuse

```bash
npm run registry:sync
npm run registry:check
npm run pack:list
npm run pack:validate
```


## v5.14 shared UI composition

`wireframe:build` now resolves `screen.related.screen_shells`, Shell `related.ui_components`, `Shell Component Placements`, Screen `Shared UI Placements`, and Screen `Shared UI Overrides`. Generated specs record shared source dependencies so a changed Header/Shell/Bottom Navigation invalidates dependent Screen projections.

Use the canonical templates:

- `kit/templates/ui-component-template.md`
- `kit/templates/screen-shell-template.md`
- `kit/templates/mobile-screen-template.md`

The renderer remains backward compatible with v5.13 Screen documents that do not use Shared UI Composition.

## v5.13 screen-first visual wireframe commands

```bash
npm run wireframe:start -- --scope all
npm run wireframe:start -- --feature FEAT-AUTH-LOGIN
npm run wireframe:start -- --screens SCR-AUTH-LOGIN,SCR-AUTH-FORGOT-PASSWORD
npm run wireframe:build
npm run wireframe:gap -- --screen SCR-AUTH-LOGIN --kind missing-action --severity high --summary "Forgot Password action is missing"
npm run wireframe:resolve -- --proposal WFG-... --status accepted --reviewer "Reviewer"
npm run wireframe:promote -- --proposal WFG-... --preset startup-bootstrap
npm run wireframe:promote -- --proposal WFG-... --plan .project-docs/wireframes/promotions/authored-plan.json --apply --reviewer "Reviewer"
npm run wireframe:resolve -- --proposal WFG-... --status resolved --reviewer "Reviewer" --note "Canonical docs updated"
npm run wireframe:check
npm run wireframe:status
npm run wireframe:close -- --reviewer "Reviewer"
```

The workflow is optional. `wireframe:build` projects canonical Screen docs into semantic JSON/text, ASCII and a combined platform-aware HTML canvas. v5.13 adds Display Profile, viewport, visual regions, typed placeholders and Secondary UI while retaining v5.12 User/Lifecycle/System/API behaviour and governed promotion. Generated artifacts are never source of truth.

## v5.10 mockup-driven documentation commands

```bash
npm run mockup:inventory
npm run mockup:tasks
npm run mockup:candidates
npm run mockup:status
npm run mockup:review -- --candidate MCKC-SCR-... --decision accepted --reviewer "Reviewer"
npm run mockup:promote -- --candidate MCKC-SCR-... --reviewer "Reviewer"
npm run mockup:report
npm run mockup:check
```

`mockup:promote` creates a draft Screen for a new candidate. When the target Screen already exists it creates a proposal by default; use `--apply-existing` only after review and only for mechanical evidence-reference reconciliation.

## v5.9 Blueprint projection commands

```bash
npm run blueprint:init
npm run blueprint:expand -- --profile standard
npm run blueprint:review -- --candidate BP-... --decision accepted --reviewer "Reviewer"
npm run blueprint:promote -- --candidate BP-... --reviewer "Reviewer"
npm run blueprint:compile -- --profile standard --audience general
npm run blueprint:render -- --profile overview --audience business
npm run blueprint:status
npm run blueprint:diff
npm run blueprint:reconcile -- --prefer linked
npm run blueprint:check
```

Blueprint runtime state lives under `.project-docs/blueprint/`. Promotion is review-gated; generated projections are derived.

## v5.8 verification commands

```bash
npm run verification:status
npm run verification:check
```

These commands validate stable Requirement Acceptance Criteria references and critical Business Rule positive/negative coverage.
