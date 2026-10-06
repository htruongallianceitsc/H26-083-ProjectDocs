# Version History

This folder keeps historical starter-kit evolution records out of the repository root while preserving them in the searchable documentation set.

## What belongs here

- version upgrade notes;
- version QA/regression reports;
- historical migration or upgrade review notes;
- one-off version transition records that are no longer primary entry documents.

## What stays at repository root

Root should remain focused on current entry/current-reference material such as `README.md`, `START_HERE.md`, `PROJECT_BLUEPRINT.md`, `DOCS_GOVERNANCE.md`, `FILE_CATALOG.md`, `STRUCTURE.md`, and current strategy references.

## Naming

Historical files may keep their original filenames so old citations and release terminology remain recognizable. New version history records should be created directly under `docs/history/`, not temporarily at root.

## Validation

`npm run docs:validate` enforces the configured root-history patterns from `starter-kit.json`. A historical release/upgrade file matching those patterns at repository root is a validation error.

## v5.4

- `V5_4_UPGRADE_NOTES.md` — Source Workspace & Starter Code Profiles.
- `V5_4_QA_REPORT.md` — source bootstrap/adoption and regression evidence.

## v5.5

- `V5_5_UPGRADE_NOTES.md` - entity/relation hardening, source/Git intelligence, local knowledge runtime.
- `V5_5_QA_REPORT.md` - regression and E2E evidence for the v5.5 runtime.


## v5.13

- `V5_13_UPGRADE_NOTES.md` — platform-aware visual wireframe layout/component enrichment.
- `V5_13_QA_REPORT.md` — visual renderer and full regression evidence.

## v5.14

- `V5_14_UPGRADE_NOTES.md` — Shared UI Components, Screen Shells, slot overrides, provenance and impact-aware wireframe composition.
- `V5_14_QA_REPORT.md` — registry, renderer, dependency-staleness and regression evidence.
