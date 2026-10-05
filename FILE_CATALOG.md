# File Catalog — v5.3

Counts exclude generated `site/`, `docs/_generated/`, and `tools/node_modules/` because they are reproducible artifacts.

- Source files: **400**
- Source Markdown files: **320**
- Standard documents: **99**
- Canonical registry JSON files: **16**
- Generated registry YAML mirrors: **8**
- Reusable pack manifests: **2**

## Root entry surface

Root intentionally stays small. The main Markdown entry/current-reference files are:

- `README.md`
- `START_HERE.md`
- `PROJECT_BLUEPRINT.md`
- `DOCS_GOVERNANCE.md`
- `FILE_CATALOG.md`
- `STRUCTURE.md`
- `CAPABILITY_PACKS.md`
- `REUSE_STRATEGY_V4.md` — retained because it is still a current reuse strategy reference, not merely version history.

Historical release/upgrade artifacts do not belong at root.

## Key directories

- `docs/` — canonical project/domain documentation.
- `docs/history/` — historical version upgrade notes, QA reports and transition reviews.
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

## v5.3 key files

- `docs/history/README.md` — history placement and naming rules.
- `docs/history/V5_3_UPGRADE_NOTES.md` — v5.3 scope and compatibility.
- `docs/history/V5_3_QA_REPORT.md` — v5.3 regression evidence.
- `standards/repository-entry-hygiene.md` — root/history governance standard.
- `starter-kit.json` → `documentationLayout` — machine-readable history directory and root-history patterns.
- `tools/scripts/docs-tool.mjs` — validates `ROOT_HISTORY_DOC`.
- `tools/scripts/e2e-test.mjs` — regression test proving root-history violations are blocked.

## Progressive Specification retained from v5.2

- `registry/spec-profiles.json`
- `standards/progressive-specification.md`
- `templates/lightweight-feature-template.md`
- `workflows/16-progressive-specification.md`
- `tools/lib/specification.mjs`
- `tools/scripts/spec-tool.mjs`
