# Production Project Documentation Starter Kit v5.1

Documentation-first starter kit for long-lived production Web, Mobile and API projects.

## Core model

```text
Core Governance Standards
        ↓
Project Type + Technology Standards
        ↓
Reuse Decision
        ↓
Project-local canonical documentation
        ↓
Typed traceability + impact analysis
        ↓
Request capture / promotion
        ↓
Dependency freshness review
        ↓
Documentation Ready Gate
        ↓
Reviewed WorkPlan
        ↓
Implementation Tasks
        ↓
Documentation reconciliation
        ↓
Done Gate
        ↓
Semantic ChangeSet / Baseline
```

## What v5.1 adds

V5.1 strengthens the maintenance/governance layer introduced by v5.0:

- dependency-aware document freshness snapshots;
- Ready/Done gates that block known stale documentation;
- stale-document quality validation;
- graph impact analysis with typed path evidence and risk levels;
- semantic ChangeSets for direct/manual documentation edits;
- named Baselines for UAT/release/migration comparison;
- Governance static-site summaries for freshness, ChangeSets and Baselines;
- expanded E2E regression for freshness, impact and change history.

## Start

1. Read `START_HERE.md`.
2. Configure `project.profile.json`.
3. Run `cd tools && npm ci && npm run qa`.
4. Build documentation before implementation tasks.
5. Before changing an existing entity, run impact analysis.
6. Reconcile important Feature documentation to activate dependency freshness tracking.
7. Use Request → Ready Gate → WorkPlan → Task for implementation work.
8. Record semantic batches with ChangeSets and create Baselines at UAT/release boundaries.

## Sources of truth

- Project/domain truth: project-local Markdown under `docs/`.
- Machine-readable policy: canonical JSON under `registry/`.
- Generated YAML views: `registry/_generated/` only.
- WorkPlan state: `.project-docs/workplans/`.
- Freshness review state: `.project-docs/freshness/`.
- Semantic history: `.project-docs/changesets/` and `.project-docs/audit-state.json`.
- Named snapshots: `.project-docs/baselines/`.
- Reuse state: `.project-docs/packs.lock.json`, snapshots and proposals.
- Generated site/reports: derived and rebuildable.

## Key v5.1 commands

```bash
cd tools

npm run impact -- --entity REQ-AUTH-001
npm run doc:check -- --entity FEAT-AUTH-LOGIN
npm run doc:reconcile -- --entity FEAT-AUTH-LOGIN --reviewer "Reviewer"

npm run request:create -- --title "..." --kind change --summary "..."
npm run request:promote -- --request REQST-... --target FEAT-...
npm run gate:ready -- --feature FEAT-...

npm run plan:scaffold -- --feature FEAT-...
npm run plan:author-complete -- --id WP-... --actor "Author"
npm run plan:submit -- --id WP-...
npm run plan:approve -- --id WP-... --reviewer "Reviewer"
npm run plan:materialize -- --id WP-... --owner "Engineering"

npm run gate:done -- --feature FEAT-...

npm run audit:init -- --actor "Team"
npm run changeset:scan -- --actor "Team" --reason "..." --related FEAT-...
npm run baseline:create -- --name UAT-1 --actor "PM"
npm run baseline:compare -- --name UAT-1

npm run qa
```

See `V5_1_UPGRADE_NOTES.md`, `V5_1_QA_REPORT.md`, `standards/document-freshness.md`, `standards/change-history-and-baselines.md`, and `workflows/15-freshness-change-history-impact.md`.
