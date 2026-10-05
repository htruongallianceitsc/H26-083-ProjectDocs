# v5.3 Upgrade Notes — Root History Hygiene

## Goal

v5.3 reduces entry-point noise by moving historical version/upgrade/QA documents out of repository root and making the layout rule enforceable.

## Changes

- Added `docs/history/` as the canonical location for historical upgrade, migration and QA records.
- Moved prior version upgrade notes and QA reports from root into `docs/history/`.
- Moved `REVIEW_UPGRADE_NOTES.md` and `V3_CAPABILITY_PACK_UPGRADE.md` into history because they are transition records rather than current entry documents.
- Kept `REUSE_STRATEGY_V4.md` at root because it remains a current strategy/reference document; classification is based on purpose, not the presence of a version label.
- Added `standards/repository-entry-hygiene.md` as a core standard.
- Added root-history validation policy in `starter-kit.json`.
- `docs:validate` now emits `ROOT_HISTORY_DOC` and fails when a matching historical document appears at root.
- Added E2E regression coverage to prevent future root-history drift.
- Updated generated catalog/site so moved history remains searchable and navigable.

## Compatibility

No project/domain entity schema, relation semantics, spec-level behavior, Ready/Done gates, freshness, impact, ChangeSet, Baseline or WorkPlan behavior changes in v5.3.

Existing links that referenced version notes at root need to point to `docs/history/...`; the starter kit updates its own references during this release.
