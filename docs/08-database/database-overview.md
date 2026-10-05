---
code: DOC-DATABASE-OVERVIEW
type: document
title: Database Overview
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [database, postgresql]
related:
  modules: []
  features: []
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: [DB-USER, DB-WORKSPACE, DB-WORKSPACE-MEMBER, DB-BOARD, DB-LIST, DB-CARD, DB-CARD-MEMBER, DB-LABEL, DB-CARD-LABEL, DB-COMMENT, DB-ACTIVITY-LOG, DB-REFRESH-TOKEN, DB-PASSWORD-RESET-TOKEN]
  tests: []
  decisions: [ADR-001, ADR-003, ADR-005]
  integrations: []
  nfrs: []
  runbooks: []
  permissions: []
  native_capabilities: []
  deep_links: []
  push_events: []
  local_storage: []
  sync_policies: []
  background_jobs_mobile: []
  analytics_events: []
  feature_flags: []
  device_test_profiles: []
  open_questions: []
  releases: []
---

# Database Overview

## Engine / Version
PostgreSQL 15+ (see `ADR-001`). Single primary instance for the MVP; no sharding or read replicas yet (`NFR-SCALE-001`).

## Schemas
All application tables live in the default `public` schema. No multi-schema/multi-tenant schema separation in v1 (Workspace is a row-level boundary, enforced in application code and via `workspace_id`/`board_id` foreign keys, not via separate PostgreSQL schemas).

## Naming Convention
- Tables: plural snake_case (`users`, `workspace_members`, `cards`).
- Columns: snake_case.
- Primary keys: `id` (UUID).
- Foreign keys: `<singular_referenced_table>_id` (e.g. `board_id`, `list_id`).

## PK Strategy
Every table uses a UUID primary key (`id uuid primary key default gen_random_uuid()`), generated application-side or via `gen_random_uuid()` (pgcrypto/pgcrypto-compatible). UUIDs avoid leaking sequential row counts and simplify client-generated optimistic-UI IDs during Card/List creation.

## Audit Columns
Every table has `created_at timestamptz not null default now()` and `updated_at timestamptz not null default now()` (updated via application code or a trigger). `updated_at` is used for optimistic concurrency checks on Card/List updates (see `API-CARD-MOVE`).

## Soft-Delete Strategy
`boards`, `lists`, `cards` use an `archived_at timestamptz null` column (see `ADR-005`). A null value means active; a non-null value means archived. Archived rows are excluded from default list/detail queries but retained indefinitely (no hard-delete endpoint in v1). `comments` use `deleted_at timestamptz null` with the same semantics (`BR-COMMENT-001`).

## Timezone / Date Strategy
All timestamps are stored as `timestamptz` in UTC. Date-only fields (e.g. Card due date) are stored as `date` with no implied timezone; the client is responsible for local display.

## Transaction / Isolation Strategy
Default PostgreSQL `READ COMMITTED` isolation. Multi-row writes that must be atomic (e.g. moving a Card: updating its `list_id`/`position` and inserting an `activity_log` row) are wrapped in a single transaction. See `API-CARD-MOVE` and `API-LIST-REORDER` for per-endpoint transaction boundaries.

## Position / Ordering Strategy
`lists.position` and `cards.position` are `double precision` fractional-index values (see `ADR-003`). Inserting/moving an item between two siblings computes `(prev.position + next.position) / 2`; a periodic rebalancing job is not required at MVP scale but is noted as a future operational task.

## Migration Tool / Process
Schema changes are managed with a SQL-first migration tool (node-pg-migrate) with one migration file per schema change, applied in CI/CD before the API deployment step (see `docs/12-devops/release-process.md`).

## Backup / Restore Assumptions
Daily automated full snapshot plus continuous WAL archiving for point-in-time recovery (provider-managed, e.g. managed PostgreSQL backup). Restore drills are a future operational runbook item.

## Performance / Index Review Process
Every foreign key column has a btree index by default. Query plans for the Board detail endpoint (`API-BOARD-GET-DETAIL`, which loads all Lists+Cards for a Board) are reviewed whenever a new filter/sort is added. See `docs/14-performance/performance-requirements.md`.
