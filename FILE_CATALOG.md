# File Catalog - v4.1

## Source inventory

Counts below exclude generated `site/` pages and `docs/_generated/` output because those are reproducible artifacts.

- Source files: approximately **337**
- Source Markdown files: approximately **285**
- Standard documents: **93**
- Canonical registry JSON files: **11**
- Generated registry YAML mirrors: **4**
- Reusable pack manifests: **2**

## Key directories

- `registry/` - canonical machine-readable project types, stacks, entity/relation/quality/reuse policies and schemas.
- `registry/_generated/` - generated YAML views; never edit directly.
- `standards/` - core, project-type, technology and capability standards.
- `templates/` - document templates plus reuse assessment/manifest/review templates.
- `prompts/` - AI prompts including capability detection and reuse promotion.
- `workflows/` - end-to-end documentation, production and reuse governance workflows.
- `reusable-modules/` - Capability Packs; AUTH is the reference implementation.
- `reusable-patterns/` - Pattern Packs; COMMON CRUD is the reference implementation.
- `tools/` - single zero-dependency NodeJS runtime plus E2E tests.
- `tools/tests/fixtures/` - isolated regression project fixtures.
- `.project-docs/` - project-local pack lock/snapshot/proposal governance state.
- `.github/workflows/` - executable CI quality gate.
- `docs/_generated/` - generated catalog/graph/traceability output.
- `site/` - generated static documentation portal.

## v4.1 key files

- `starter-kit.json` - canonical starter/version schema metadata.
- `V4_1_UPGRADE_NOTES.md` - scope and migration notes.
- `V4_1_QA_REPORT.md` - regression evidence.
- `registry/README.md` - registry source-of-truth rules.
- `tools/scripts/registry-tool.mjs` - registry sync/drift checker.
- `tools/scripts/e2e-test.mjs` - isolated regression runner.
- `.github/workflows/docs.yml` - real CI workflow running `npm run qa`.
