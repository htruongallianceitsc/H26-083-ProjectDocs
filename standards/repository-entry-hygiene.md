# Repository Entry & History Hygiene Standard — v5.3

## Purpose

Keep the repository root useful as a fast entry surface instead of turning it into a chronological archive.

## Rules

1. Root contains current entry/current-reference documents only.
2. Version upgrade notes, QA reports and historical migration/review notes live in `docs/history/`.
3. Historical files keep stable filenames unless there is a concrete migration reason to rename them.
4. Do not move current strategy/reference documents only because their filename contains an older version label; classify by purpose, not by filename alone.
5. New version notes and QA reports must be created directly under `docs/history/`.
6. Generated indexes and the static site remain responsible for discoverability after files move.
7. `docs:validate` must fail when a configured historical filename pattern appears at repository root.
8. Links to historical records must use their `docs/history/...` path.

## Root entry set

Typical root entry documents are:

- `README.md`
- `START_HERE.md`
- `PROJECT_BLUEPRINT.md`
- `DOCS_GOVERNANCE.md`
- `FILE_CATALOG.md`
- `STRUCTURE.md`
- current strategy/reference documents

This is guidance, not a strict root allowlist. The hard rule is that historical release/upgrade artifacts must not return to root.
