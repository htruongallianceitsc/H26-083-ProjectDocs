---
code: DB-LIST
type: database-object
title: List
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [database, list]
object_name: lists
object_type: table
related:
  modules: [MOD-LIST]
  features: [FEAT-LIST-MANAGE, FEAT-LIST-REORDER]
  requirements: []
  business_rules: [BR-LIST-001, BR-LIST-002]
  screens: []
  flows: []
  apis: [API-LIST-CREATE, API-LIST-UPDATE, API-LIST-REORDER]
  database_objects: [DB-BOARD]
  tests: []
  decisions: [ADR-003, ADR-005]
---

# Database Object

## Purpose
A named, ordered column on a Board.

## Object
- Schema: `public`
- Name: `lists`
- Type: Table
- Owner Module: `MOD-LIST`

## Columns

| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| board_id | uuid | No | - | FK to `boards.id` |
| title | text | No | - | List display name |
| position | double precision | No | - | Fractional ordering key within the board (`ADR-003`) |
| archived_at | timestamptz | Yes | null | Soft-delete marker |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit |

## Primary Key
`id`

## Foreign Keys
- `board_id` -> `boards.id`

## Unique / Check Constraints
- `CHECK (char_length(title) BETWEEN 1 AND 60)`

## Indexes

| Index | Columns | Unique | Purpose |
|---|---|---:|---|
| lists_board_id_position_idx | board_id, position | No | Ordered list retrieval for `API-BOARD-GET-DETAIL`, filtered by `archived_at IS NULL` |

## Read By
`API-BOARD-GET-DETAIL` (nested under board response).

## Written By
`API-LIST-CREATE` (insert, computing next `position`), `API-LIST-UPDATE` (title/archive), `API-LIST-REORDER` (updates `position`).

## Lifecycle / Soft Delete
`archived_at` soft-delete; an archived List cannot accept new Cards (`BR-LIST-001`).

## Sensitive Data / Retention
None.

## Expected Volume / Growth
Typically 3-10 Lists per Board.

## Concurrency / Transaction Notes
`API-LIST-REORDER` recomputes `position` as the midpoint between the two new neighbors inside a transaction to avoid collisions under concurrent reorders; see `BR-LIST-002`.

## Migration / Backfill Notes
Depends on `boards`. `API-BOARD-CREATE` seeds 3 default Lists ("To Do", "In Progress", "Done") at creation time.
