# Project Documentation Bundle

## Purpose

Move canonical project documentation from an older starter-kit project into a newer starter without manually copying folder trees or replaying every intermediate starter version.

The user-facing workflow is intentionally small:

```bash
# old project
cd tools
npm run docs:export

# new project
cd tools
npm run docs:import -- --file ../ProjectDocsExport.zip
```

## Exporting a pre-v5.15 project

Projects created from v5.14 or earlier do not contain the new export command. Do **not** upgrade their starter files just to export. From a v5.15 project/toolchain, point the exporter at the old project:

```bash
cd <new-v5.15-project>/tools
npm run docs:export -- --source ../../OldProject
```

The v5.15 exporter scans the old project's `docs/` directly and writes the bundle into `<OldProject>/.project-docs/exports/ProjectDocsExport.zip` by default. It does not require `documentation-bundle.json` or other v5.15 registry files to exist in the old project.

## Transfer model

```text
Old project docs
      |
      | docs:export
      v
ProjectDocsExport.zip
  - manifest.json
  - entities.json
  - relations.json
  - entities/*.md
  - context/*
      |
      | docs:import
      v
Current entity registry + current folder mapping
      |
      v
New project docs/**
```

The ZIP is a transport format, not a second source of truth. Source and target projects continue to use their own canonical Markdown files.

## What is exported by default

The bundle exports typed canonical entities under `docs/` and their relation metadata. Generated docs, starter-kit guides and version history are excluded because they belong to the starter rather than the project knowledge being transferred.

Source `project.profile.json` and `PROJECT_BLUEPRINT.md` are included under `context/` for audit/review. Import stores this context with the import report; it does not silently replace the target profile or Blueprint.

## Stable bundle contract

The bundle contract has its own schema version:

```json
{
  "format": "project-documentation-bundle",
  "schemaVersion": 1
}
```

It is intentionally independent from `starter-kit.json.version`. A v5.10 source and a v5.15 target can exchange bundle schema v1 without forcing the target to replay v5.11-v5.14 folder migrations.

## Identity rules

- Existing `uid`, `code` and `revision` are preserved.
- If a legacy entity has no UID, export assigns a deterministic UUID derived from `type + code`.
- If revision is missing/invalid, revision `1` is used.
- Re-importing the same bundle is idempotent: semantically identical entities are skipped.

## Current-layout mapping

The target starter owns folder placement through `kit/registry/documentation-bundle.json`.

Examples:

- `module` -> `docs/02-modules/<MODULE>/module.md`
- `feature` -> `docs/02-modules/<MODULE>/<FEATURE>/feature.md`
- `screen` -> `docs/05-screens/<CODE>.md`
- `ui-component` -> `docs/05-screens/shared/components/<CODE>.md`
- `screen-shell` -> `docs/05-screens/shared/shells/<CODE>.md`
- `api` -> `docs/07-api/<CODE>.md`
- `test-case` -> `docs/11-quality/test-cases/<CODE>.md`

A Feature uses `related.modules` to resolve its Module. If no Module relation exists, the importer places it under `_UNASSIGNED` and leaves the missing relationship visible for later reconciliation.

## Conflict behavior

Default behavior is safe:

- same semantic entity -> skip;
- same `code`/`uid` with different content -> conflict;
- occupied target path -> conflict;
- no type mapping -> unmapped;
- no silent overwrite.

Preview:

```bash
npm run docs:import -- --file ../ProjectDocsExport.zip --dry-run
```

Explicit replacement after review:

```bash
npm run docs:import -- --file ../ProjectDocsExport.zip --on-conflict replace
```

Use replacement sparingly. The default `skip` behavior preserves existing target truth and records the conflict.

## Post-import reconciliation

A normal import runs:

1. documentation validation;
2. local knowledge reindex;
3. generated documentation sync;
4. static site build;
5. static site link check.

Use `--no-rebuild` only for tooling/tests or when you deliberately want to reconcile later.

## Import evidence

Each non-dry-run import creates:

```text
.project-docs/imports/IMP-.../
├── import-report.json
└── source-context/
    ├── project.profile.json
    └── PROJECT_BLUEPRINT.md
```

The report records source/target starter versions, imported/skipped/conflicting entities and each post-import reconciliation result.

## Scope boundary

This workflow is for **old documentation -> new documentation structure**.

It is intentionally separate from:

- `layout:migrate`: migrates starter-kit framework folders;
- `brownfield:*`: discovers documentation from existing source code;
- `pack:import`: imports a reusable capability/pattern pack.
