# START HERE — v5.1

## 1. Configure the project

Fill `project.profile.json` from `PROJECT_PROFILE.example.json` and select only the project types/technology stacks actually used.

## 2. Build documentation before tasks

```text
Idea → Discovery → Scope → Blueprint → Reuse decision
→ Module / Feature → Requirement / Business Rule
→ Screen / Flow / API / DB → Test
→ Freshness / Ready Gate → WorkPlan → Tasks
→ Implementation → Documentation reconciliation
→ Done Gate → ChangeSet / Baseline
```

## 3. Analyze impact before changing existing knowledge

```bash
cd tools
npm run impact -- --entity REQ-...
```

Treat results as potential impact. Review HIGH candidates first.

## 4. Activate dependency freshness for important Features

After a Feature and its related docs are reviewed:

```bash
npm run doc:reconcile -- --entity FEAT-... --reviewer "Reviewer" --note "Initial reviewed baseline"
npm run doc:check -- --entity FEAT-...
```

After this point, Requirement/API/Screen/Test/Request dependency drift can mark the Feature `STALE` and block implementation gates.

## 5. Capture durable incoming requests

```bash
npm run request:create -- --title "..." --kind change --summary "..."
npm run request:promote -- --request REQST-... --target FEAT-...
```

Promotion itself may invalidate an existing freshness snapshot; review/reconcile the Feature before implementation planning.

## 6. Do not generate tasks until Ready passes

```bash
npm run docs:validate
npm run doc:check -- --entity FEAT-...
npm run gate:ready -- --feature FEAT-...
```

## 7. Use a reviewed WorkPlan

```bash
npm run plan:scaffold -- --feature FEAT-...
# Review/edit .project-docs/workplans/WP-....json
npm run plan:author-complete -- --id WP-... --actor "Author"
npm run plan:submit -- --id WP-...
npm run plan:approve -- --id WP-... --reviewer "Reviewer"
npm run plan:materialize -- --id WP-... --owner "Engineering"
```

WorkPlan submit still protects the exact reviewed context with SHA-256 fingerprints.

## 8. Reconcile after implementation

When implementation changes tests/contracts/status:

```bash
npm run doc:check -- --entity FEAT-...
# review/update canonical docs
npm run doc:reconcile -- --entity FEAT-... --reviewer "Reviewer" --note "Implementation reconciled"
npm run gate:done -- --feature FEAT-...
```

## 9. Record semantic history

Initialize once for a project/workspace:

```bash
npm run audit:init -- --actor "Team"
```

After a meaningful reviewed batch:

```bash
npm run changeset:scan -- --actor "Team" --reason "..." --related FEAT-...
```

At UAT/release/migration boundaries:

```bash
npm run baseline:create -- --name UAT-1 --actor "PM" --note "UAT handoff"
npm run baseline:compare -- --name UAT-1
```

## 10. Run full QA

```bash
npm run qa
```

QA covers registry drift, profile/reuse validation, documentation graph, freshness quality, static site, and the v5.1 end-to-end governance regression.
