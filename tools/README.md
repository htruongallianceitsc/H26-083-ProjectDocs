# Documentation Toolchain v5.1

Requires Node.js 20+. No third-party npm runtime dependencies are required.

## Runtime architecture

```text
tools/scripts/docs-tool.mjs        validation/sync/site
tools/scripts/pack-tool.mjs        Pattern/Capability Pack lifecycle
tools/scripts/registry-tool.mjs    canonical registry sync/check
tools/scripts/request-tool.mjs     Request intake/promotion
tools/scripts/gate-tool.mjs        Ready/Done gates
tools/scripts/plan-tool.mjs        WorkPlan lifecycle/task materialization
tools/scripts/freshness-tool.mjs   dependency freshness check/reconcile
tools/scripts/impact-tool.mjs      typed graph impact analysis
tools/scripts/change-tool.mjs      audit/ChangeSet/Baseline commands
tools/scripts/e2e-test.mjs         isolated regression runner
        ↓
tools/lib/common.mjs
tools/lib/governance.mjs
tools/lib/freshness.mjs
tools/lib/impact.mjs
tools/lib/change-history.mjs
```

## Full QA

```bash
cd tools
npm ci
npm run qa
```

## Freshness

```bash
npm run doc:check -- --entity FEAT-...
npm run doc:reconcile -- --entity FEAT-... --reviewer "Reviewer" --note "..."
```

## Impact

```bash
npm run impact -- --entity REQ-...
npm run impact -- --entity API-... -- --depth 2
```

## ChangeSets / Baselines

```bash
npm run audit:init -- --actor "Team"
npm run changeset:scan -- --actor "Team" --reason "..." --related FEAT-...
npm run changeset:list
npm run changeset:show -- --id CHG-...

npm run baseline:create -- --name UAT-1 --actor "PM" --note "..."
npm run baseline:list
npm run baseline:compare -- --name UAT-1
```

## Request / Gate / WorkPlan

```bash
npm run request:create -- --title "..." --kind change --summary "..."
npm run request:promote -- --request REQST-... --target FEAT-...
npm run gate:ready -- --feature FEAT-...
npm run plan:scaffold -- --feature FEAT-...
npm run plan:author-complete -- --id WP-... --actor "Author"
npm run plan:submit -- --id WP-...
npm run plan:approve -- --id WP-... --reviewer "Reviewer"
npm run plan:materialize -- --id WP-... --owner "Engineering"
npm run gate:done -- --feature FEAT-...
```

## Registry / reuse

```bash
npm run registry:sync
npm run registry:check
npm run pack:list
npm run pack:validate
```
