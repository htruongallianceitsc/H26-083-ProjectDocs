# File Catalog — v5.8

Counts exclude generated `.project-docs/site/`, `docs/_generated/`, and `tools/node_modules/` because they are reproducible artifacts.

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
- `kit/registry/` — canonical entity/relation/quality/readiness/spec/freshness/impact/reuse policy.
- `kit/registry/_generated/` — generated YAML mirrors; never edit directly.
- `kit/standards/` — governance, project-type, stack, reuse and implementation standards.
- `kit/templates/` — documentation templates including Lightweight Feature.
- `kit/prompts/` — AI orchestration/review prompts.
- `kit/workflows/` — docs-first lifecycle, progressive specification, reuse, implementation and maintenance workflows.
- `tools/` — zero-dependency NodeJS runtime and regression tests.
- `.project-docs/spec-promotions/` — generated promotion gap reports.
- `.project-docs/workplans/` — reviewed WorkPlans and context hashes.
- `.project-docs/freshness/` — dependency reconciliation snapshots.
- `.project-docs/changesets/` — semantic change records.
- `.project-docs/baselines/` — named milestone fingerprints.
- `.github/workflows/` — executable CI quality gate.
- `docs/_generated/` — derived catalog/graph/traceability/spec/freshness/governance output.
- `.project-docs/site/` — generated static documentation portal.

## v5.3 key files

- `docs/history/README.md` — history placement and naming rules.
- `docs/history/V5_3_UPGRADE_NOTES.md` — v5.3 scope and compatibility.
- `docs/history/V5_3_QA_REPORT.md` — v5.3 regression evidence.
- `kit/standards/repository-entry-hygiene.md` — root/history governance standard.
- `starter-kit.json` → `documentationLayout` — machine-readable history directory and root-history patterns.
- `tools/scripts/docs-tool.mjs` — validates `ROOT_HISTORY_DOC`.
- `tools/scripts/e2e-test.mjs` — regression test proving root-history violations are blocked.

## Progressive Specification retained from v5.2

- `kit/registry/spec-profiles.json`
- `kit/standards/progressive-specification.md`
- `kit/templates/lightweight-feature-template.md`
- `kit/workflows/16-progressive-specification.md`
- `tools/lib/specification.mjs`
- `tools/scripts/spec-tool.mjs`


## v5.4 key files

- `kit/registry/source-profiles.json` — canonical stack/application source profiles.
- `kit/registry/source-base.schema.json` — Source Base manifest contract.
- `kit/source-bases/` — versioned bootstrap skeleton library.
- `docs/24-applications/` — canonical Application entities.
- `.project-docs/source.lock.json` — source provenance/materialization state.
- `kit/standards/source-workspace.md` — common workspace rules.
- `kit/standards/source-base-governance.md` — Source Base lifecycle.
- `kit/workflows/17-source-workspace-bootstrap.md` — greenfield/adoption workflow.
- `kit/prompts/41-source-profile-selection.md` through `43-existing-source-adoption.md`.
- `docs/history/V5_4_UPGRADE_NOTES.md` and `docs/history/V5_4_QA_REPORT.md`.

## v5.5 key files

- `kit/registry/entity-policy.json` - permanent identity, lifecycle and relation enforcement policy.
- `kit/registry/source-intelligence.json` - source scan and mapping configuration.
- `kit/registry/local-engine.json` - local index/search/query/context configuration.
- `kit/registry/views.json` - reusable query views.
- `tools/scripts/entity-tool.mjs` - UID backfill and lifecycle transition commands.
- `tools/scripts/source-intelligence-tool.mjs` - source scan/map and Git impact commands.
- `tools/scripts/knowledge-tool.mjs` - reindex/search/query/context/view commands.
- `tools/scripts/doctor-tool.mjs` - workspace diagnostics and safe index repair.
- `.project-docs/indexes/` - disposable local entity/relation/search/source indexes.
- `.project-docs/reports/` - generated context and Git-impact reports.
- `docs/history/V5_5_UPGRADE_NOTES.md` and `docs/history/V5_5_QA_REPORT.md`.

## v5.6 key files

- `starter-kit.json` → `workspaceLayout` and `legacyLayoutAliases`.
- `kit/` — consolidated framework surface.
- `kit/reuse/capabilities/` and `kit/reuse/patterns/` — reusable package libraries.
- `kit/source-bases/` — Source Base library.
- `kit/examples/project-profile.example.json` — project-profile example moved out of root.
- `.project-docs/site/` — generated static site.
- `tools/scripts/layout-tool.mjs` — layout validation and preview/apply migration.
- `tools/lib/common.mjs` — centralized workspace path resolution and legacy alias compatibility.
- `docs/history/V5_6_UPGRADE_NOTES.md` and `docs/history/V5_6_QA_REPORT.md`.

## v5.7 Brownfield files

| Path | Role | Canonical? |
|---|---|---|
| `kit/registry/brownfield.json` | Brownfield policy, confidence thresholds, adapter hints and normalization safety | Yes, framework policy |
| `kit/standards/brownfield-adoption.md` | Adoption/reconciliation standard | Yes, framework standard |
| `kit/workflows/18-brownfield-adoption.md` | End-to-end existing-project workflow | Yes, framework workflow |
| `kit/templates/brownfield/` | Candidate/reconciliation/refactor review templates | Yes, framework templates |
| `.project-docs/brownfield/inventory.json` | Source inventory evidence | No, derived |
| `.project-docs/brownfield/candidates.json` | Reviewable candidate graph and review/promotion state | Governance runtime; not domain truth |
| `.project-docs/brownfield/reconciliation.json` | Brownfield mismatch/gate evidence | No, derived |
| `.project-docs/brownfield/refactor-plan.json` | Non-executing source-normalization proposal | No, planning evidence |


## v5.8 Verification files

- `kit/standards/acceptance-and-verification-traceability.md` — canonical verification standard.
- `kit/workflows/19-acceptance-verification.md` — BA→QA workflow.
- `kit/prompts/41-acceptance-verification-traceability.md` — authoring/review prompt.
- `tools/lib/verification.mjs` — AC and Business Rule coverage engine.
- `tools/scripts/verification-tool.mjs` — status/check CLI.
- `docs/_generated/verification.json` — derived documentation view.
- `.project-docs/reports/verification-report.json` — derived QA report.

## Documentation transfer (v5.15)

- `kit/registry/documentation-bundle.json` — portable bundle format and current entity-type destination mapping.
- `.project-docs/exports/` — generated documentation transfer ZIPs.
- `.project-docs/imports/` — import reports and captured source context.
