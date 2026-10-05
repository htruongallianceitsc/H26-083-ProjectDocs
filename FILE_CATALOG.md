# File Catalog — v5.1

Counts exclude generated `site/`, `docs/_generated/`, and `tools/node_modules/` because they are reproducible artifacts.

- Source files: **383**
- Source Markdown files: **308**
- Standard documents: **97**
- Canonical registry JSON files: **15**
- Generated registry YAML mirrors: **7**
- Reusable pack manifests: **2**

## Key directories

- `docs/` — canonical project/domain documentation.
- `docs/21-requests/` — durable request/change intake.
- `docs/22-tasks/` — implementation tasks materialized from reviewed WorkPlans.
- `docs/23-bugs/` — durable defect records.
- `registry/` — canonical entity/relation/quality/readiness/freshness/impact/reuse policy.
- `registry/_generated/` — generated YAML mirrors; never edit directly.
- `standards/` — governance, project-type, stack, reuse and implementation standards.
- `templates/` — documentation/Request/Task/Bug/WorkPlan templates.
- `prompts/` — AI orchestration/review prompts.
- `workflows/` — docs-first lifecycle, reuse, implementation and maintenance workflows.
- `reusable-modules/` — Capability Packs.
- `reusable-patterns/` — Pattern Packs.
- `tools/` — zero-dependency NodeJS runtime and regression tests.
- `.project-docs/workplans/` — reviewed WorkPlans and context hashes.
- `.project-docs/freshness/` — dependency reconciliation snapshots.
- `.project-docs/changesets/` — semantic change records.
- `.project-docs/baselines/` — named milestone fingerprints.
- `.project-docs/audit-state.json` — local direct-edit detection state.
- `.project-docs/pack-*` — reusable-pack governance state.
- `.github/workflows/` — executable CI quality gate.
- `docs/_generated/` — derived catalog/graph/traceability/freshness/governance output.
- `site/` — generated static documentation portal.

## v5.1 key files

- `starter-kit.json` — starter/schema version metadata.
- `registry/readiness-rules.json` — Ready/Done gates.
- `registry/freshness-rules.json` — dependency freshness policy.
- `registry/impact-rules.json` — graph impact traversal/weights.
- `standards/document-freshness.md` — freshness lifecycle/rules.
- `standards/change-history-and-baselines.md` — ChangeSet/Baseline governance.
- `standards/impact-analysis.md` — potential-impact rules.
- `workflows/15-freshness-change-history-impact.md` — v5.1 maintenance workflow.
- `tools/scripts/freshness-tool.mjs` — freshness check/reconcile.
- `tools/scripts/impact-tool.mjs` — graph impact analyzer.
- `tools/scripts/change-tool.mjs` — audit/ChangeSet/Baseline runtime.
- `tools/lib/freshness.mjs` — dependency fingerprint engine.
- `tools/lib/impact.mjs` — weighted graph traversal.
- `tools/lib/change-history.mjs` — semantic snapshot/diff logic.
- `V5_1_UPGRADE_NOTES.md` — v5.1 scope and behavior.
- `V5_1_QA_REPORT.md` — regression evidence.
