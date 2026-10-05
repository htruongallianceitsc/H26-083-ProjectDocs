# File Catalog — v5.5

Counts exclude generated `site/`, `docs/_generated/`, and `tools/node_modules/` because they are reproducible artifacts.

- Source files: **400**
- Source Markdown files: **320**
- Standard documents: **99**
- Canonical registry JSON files: **16**
- Generated registry YAML mirrors: **8**
- Reusable pack manifests: **2**

## Root entry surface

Root intentionally stays small as a fast entry surface. The root files are strictly:

- `README.md`
- `START_HERE.md`
- `PROJECT_BLUEPRINT.md`
- `project.profile.json`
- `starter-kit.json`

Historical release/upgrade artifacts and general guides do not belong at root.

## Key directories

- `docs/` — canonical project/domain documentation.
- `docs/guides/` — general guides and repository navigation references.
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


## v5.4 key files

- `registry/source-profiles.json` — canonical stack/application source profiles.
- `registry/source-base.schema.json` — Source Base manifest contract.
- `source-bases/` — versioned bootstrap skeleton library.
- `docs/24-applications/` — canonical Application entities.
- `.project-docs/source.lock.json` — source provenance/materialization state.
- `standards/source-workspace.md` — common workspace rules.
- `standards/source-base-governance.md` — Source Base lifecycle.
- `workflows/17-source-workspace-bootstrap.md` — greenfield/adoption workflow.
- `prompts/41-source-profile-selection.md` through `43-existing-source-adoption.md`.
- `docs/history/V5_4_UPGRADE_NOTES.md` and `docs/history/V5_4_QA_REPORT.md`.

## v5.5 key files

- `registry/entity-policy.json` - permanent identity, lifecycle and relation enforcement policy.
- `registry/source-intelligence.json` - source scan and mapping configuration.
- `registry/local-engine.json` - local index/search/query/context configuration.
- `registry/views.json` - reusable query views.
- `tools/scripts/entity-tool.mjs` - UID backfill and lifecycle transition commands.
- `tools/scripts/source-intelligence-tool.mjs` - source scan/map and Git impact commands.
- `tools/scripts/knowledge-tool.mjs` - reindex/search/query/context/view commands.
- `tools/scripts/doctor-tool.mjs` - workspace diagnostics and safe index repair.
- `.project-docs/indexes/` - disposable local entity/relation/search/source indexes.
- `.project-docs/reports/` - generated context and Git-impact reports.
- `docs/history/V5_5_UPGRADE_NOTES.md` and `docs/history/V5_5_QA_REPORT.md`.
