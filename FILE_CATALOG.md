# File Catalog — v5.2

Counts exclude generated `site/`, `docs/_generated/`, and `tools/node_modules/` because they are reproducible artifacts.

- Source files: **396**
- Source Markdown files: **316**
- Standard documents: **98**
- Canonical registry JSON files: **16**
- Generated registry YAML mirrors: **8**
- Reusable pack manifests: **2**

## Key directories

- `docs/` — canonical project/domain documentation.
- `docs/21-requests/` — durable request/change intake.
- `docs/22-tasks/` — implementation tasks materialized from reviewed WorkPlans.
- `docs/23-bugs/` — durable defect records.
- `registry/` — canonical entity/relation/quality/readiness/spec/freshness/impact/reuse policy.
- `registry/_generated/` — generated YAML mirrors; never edit directly.
- `standards/` — governance, project-type, stack, reuse and implementation standards.
- `templates/` — documentation templates including Lightweight Feature.
- `prompts/` — AI orchestration/review prompts.
- `workflows/` — docs-first lifecycle, progressive specification, reuse, implementation and maintenance workflows.
- `tools/` — zero-dependency NodeJS runtime and regression tests.
- `.project-docs/spec-promotions/` — generated promotion gap reports.
- `.project-docs/workplans/` — reviewed WorkPlans and context hashes.
- `.project-docs/freshness/` — dependency reconciliation snapshots.
- `.project-docs/changesets/` — semantic change records.
- `.project-docs/baselines/` — named milestone fingerprints.
- `.github/workflows/` — executable CI quality gate.
- `docs/_generated/` — derived catalog/graph/traceability/spec/freshness/governance output.
- `site/` — generated static documentation portal.

## v5.2 key files

- `registry/spec-profiles.json` — spec levels, maturity and risk policy.
- `standards/progressive-specification.md` — progressive depth standard.
- `templates/lightweight-feature-template.md` — minimal canonical Feature template.
- `workflows/16-progressive-specification.md` — selection/promotion workflow.
- `tools/lib/specification.mjs` — spec resolution/compliance/risk engine.
- `tools/scripts/spec-tool.mjs` — status/check/recommend/promote commands.
- `registry/readiness-rules.json` — mode-aware Ready/Done gate integration.
- `registry/workplan.schema.json` — backward-compatible WorkPlan 1.0/1.1 schema.
- `V5_2_UPGRADE_NOTES.md` — v5.2 scope and compatibility.
- `V5_2_QA_REPORT.md` — regression evidence.
