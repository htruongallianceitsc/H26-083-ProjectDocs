# v5.0 Upgrade Notes

## Goal

V5.0 moves the starter kit from "documentation + validation" to an enforceable documentation-first implementation bridge.

The release implements the roadmap milestone:

```text
Request -> Documentation -> Ready Gate -> WorkPlan -> Task
```

and adds the first Done gate after implementation reconciliation.

## Added entity types

- `request`
- `task`
- `bug`

These are canonical project entities under `docs/` and participate in the same relation graph as existing Feature/Requirement/API/Test entities.

## Added folders

- `docs/21-requests/`
- `docs/22-tasks/`
- `docs/23-bugs/`
- `.project-docs/workplans/`

## Added registries

### `registry/readiness-rules.json`

Machine-readable Ready/Done rules. V5 tooling evaluates this config rather than embedding project-specific gate criteria in prompts.

### `registry/workplan.schema.json`

Defines the WorkPlan governance artifact shape. WorkPlans intentionally remain outside the domain entity registry.

## Request workflow

New tool commands:

```bash
npm run request:create -- --title "..." --kind change --summary "..."
npm run request:list
npm run request:promote -- --request REQST-... --target FEAT-...
npm run request:close -- --request REQST-...
```

A Request is intake/provenance. Canonical Feature/Requirement/etc. documents must still be created or updated separately.

## Ready / Done gates

```bash
npm run gate:ready -- --feature FEAT-...
npm run gate:done -- --feature FEAT-...
```

Default Ready checks:

- Feature status is implementation-compatible.
- Requirement relation minimum is satisfied.
- Test relation minimum is satisfied.
- Requirement/Test statuses are acceptable.
- No linked blocking/open Open Question exists.
- Reusable pack review is approved when required.

Default Done checks:

- Feature is `implemented`.
- Feature tests are `passed`.
- At least one incoming Task exists.
- All incoming Tasks are `done`.
- No linked blocking/open Open Question exists.

## WorkPlan lifecycle

New lifecycle:

```text
draft
  -> author-complete
  -> submitted
  -> approved / rejected
  -> materialized
```

Commands:

```bash
npm run plan:scaffold -- --feature FEAT-...
npm run plan:validate -- --id WP-...
npm run plan:author-complete -- --id WP-... --actor "..."
npm run plan:submit -- --id WP-...
npm run plan:approve -- --id WP-... --reviewer "..."
npm run plan:reject -- --id WP-... --reviewer "..."
npm run plan:materialize -- --id WP-... --owner "Engineering"
npm run plan:list
npm run plan:show -- --id WP-...
```

## Stale-context protection

Submission calculates a SHA-256 fingerprint from the target Feature, its direct related entities, and Requests promoted to that Feature.

Approval and task materialization recompute this fingerprint. If documentation changed, the operation fails with `STALE_CONTEXT`.

This prevents an implementation plan from being approved against documentation that is no longer the version reviewers saw.

## Traceability/site changes

- Feature traceability now includes incoming Tasks.
- `docs/_generated/governance.json` summarizes Request/Task/Bug/WorkPlan state.
- Static documentation portal includes a new Governance page.
- Dashboard includes Request/Task/WorkPlan counts.

## QA changes

V5 E2E regression now tests:

1. valid project graph;
2. Ready gate pass;
3. Request creation/promotion;
4. WorkPlan scaffold/validation/authoring/submission;
5. stale context approval rejection;
6. successful approval after context restoration;
7. task materialization;
8. Done gate failure before completion;
9. Done gate success after Feature/Test/Task completion;
10. broken relation failure path.

## Intentionally deferred

V5.0 does not yet implement the next roadmap layers:

- dependency-aware document freshness/reconciliation;
- semantic ChangeSet / baseline history;
- richer graph impact engine;
- source/Git/OpenAPI/DB/Test scanners.

Those remain v5.1/v6.0 concerns.
