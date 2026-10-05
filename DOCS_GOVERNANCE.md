# Documentation Governance v5.1

## Principle

Documentation is reviewed before implementation and remains governed after review. A recent review date alone is not proof that dependent knowledge is still current.

## Canonical layers

1. `docs/` — product/project truth.
2. `registry/*.json` — machine-readable schema/policy truth.
3. `.project-docs/workplans/` — reviewed implementation planning state.
4. `.project-docs/freshness/` — dependency review snapshots.
5. `.project-docs/changesets/` + `audit-state.json` — semantic change history.
6. `.project-docs/baselines/` — named milestone fingerprints.
7. `.project-docs/packs.*` — reusable-pack governance.
8. `docs/_generated/` and `site/` — derived views only.

## Change intake and impact

Capture durable change provenance as Request entities. Before material edits to existing entities, run the typed graph impact engine and inspect HIGH/MEDIUM candidates.

Impact evidence is potential impact, not runtime proof.

## Freshness governance

`registry/freshness-rules.json` defines which dependencies are fingerprinted. `doc:reconcile` records the reviewed dependency state.

Default states:

- `UNTRACKED`: adoption not started; non-blocking.
- `FRESH`: dependencies match review snapshot.
- `SELF_CHANGED`: tracked document changed but dependencies did not.
- `STALE`: dependency content or relation membership changed; blocking by default.

Never reconcile merely to clear a warning. Review the changed dependency and update canonical docs first when needed.

## Documentation gate

Implementation planning targets a Feature that passes `registry/readiness-rules.json`.

Ready checks include Requirement/Test coverage/status, blocking Open Questions, reusable-pack review state, and known stale-document state.

## WorkPlan and Task governance

WorkPlans remain outside domain truth, capture context hash at submit, and materialize Tasks only after approval. `STALE_CONTEXT` still protects the exact Feature context reviewers saw even when freshness snapshots exist.

## Completion governance

Done requires implemented Feature status, passed tests, completed incoming Tasks, no blocking questions, and no known stale documentation. After implementation changes a tracked dependency, reconcile docs before Done.

## Semantic history

ChangeSets record reviewed semantic batches with actor/reason/related references and before/after snapshots. Baselines provide immutable named comparison points for UAT/release/migration.

Generated files are excluded from semantic history.

## No-bypass rule

When freshness, Ready, WorkPlan context, Done, validation or reuse gates fail, remediate project knowledge. Do not edit hashes/rules merely to make the gate pass.
