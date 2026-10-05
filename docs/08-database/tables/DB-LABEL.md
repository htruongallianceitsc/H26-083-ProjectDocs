---
code: DB-LABEL
type: database-object
title: Label
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [database, label]
object_name: labels
object_type: table
related:
  modules: [MOD-LABEL]
  features: [FEAT-LABEL-MANAGE]
  requirements: []
  business_rules: [BR-LABEL-001]
  screens: []
  flows: []
  apis: [API-LABEL-CREATE, API-LABEL-UPDATE, API-LABEL-DELETE]
  database_objects: [DB-BOARD]
  tests: []
  decisions: []
---

# Database Object

## Purpose
A board-scoped, colored tag that can be assigned to Cards.

## Object
- Schema: `public`
- Name: `labels`
- Type: Table
- Owner Module: `MOD-LABEL`

## Columns

| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| board_id | uuid | No | - | FK to `boards.id` |
| name | text | No | - | Label text (e.g. "Bug") |
| color | text | No | - | Color token (e.g. `red`, `green`, hex code) |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit |

## Primary Key
`id`

## Foreign Keys
- `board_id` -> `boards.id`

## Unique / Check Constraints
- `UNIQUE (board_id, name)` (`BR-LABEL-001`)
- `CHECK (char_length(name) BETWEEN 1 AND 40)`

## Indexes

| Index | Columns | Unique | Purpose |
|---|---|---:|---|
| labels_board_id_name_key | board_id, name | Yes | Enforce per-board uniqueness, list labels for a board |

## Read By
`API-BOARD-GET-DETAIL` (board's label palette), `API-CARD-GET-DETAIL`.

## Written By
`API-LABEL-CREATE` (insert), `API-LABEL-UPDATE` (name/color), `API-LABEL-DELETE` (delete, cascades `card_labels`).

## Lifecycle / Soft Delete
Hard delete; deleting a Label removes it from all Cards via `ON DELETE CASCADE` on `card_labels.label_id`.

## Sensitive Data / Retention
None.

## Expected Volume / Growth
A handful of labels per board (typically under 20).

## Concurrency / Transaction Notes
`UNIQUE (board_id, name)` prevents duplicate concurrent label creation with the same name.

## Migration / Backfill Notes
Depends on `boards`.
