# Documentation Toolchain v5.4

Requires Node.js 20+. No third-party npm runtime dependencies are required.

## Progressive specification

```bash
npm run spec:status
npm run spec:check -- --feature FEAT-...
npm run spec:recommend -- --feature FEAT-...
npm run spec:promote -- --feature FEAT-... --to standard
npm run spec:promote -- --feature FEAT-... --to standard --apply
```

`spec:promote` writes a gap report under `.project-docs/spec-promotions/`. `--apply` is rejected while target-level gaps remain.

## Full QA

```bash
npm ci
npm run qa
```

`docs:all` now runs `spec:check` before graph validation/build.

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

WorkPlan schema 1.1 snapshots effective spec level, target maturity and risk recommendation while remaining backward-compatible with v1.0 plans.

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

## Root/history hygiene

Historical version upgrade/QA records live in `docs/history/`. `docs:validate` reads `starter-kit.json.documentationLayout.rootHistoryPatterns` and fails with `ROOT_HISTORY_DOC` if a matching historical file is placed at repository root.


## Source workspace commands (v5.4)

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

`source:validate` validates bundled Source Base manifests/templates. `source:check` validates configured project applications.
