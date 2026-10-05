---
code: DB-CARD
type: database-object
title: Card
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [database, card]
object_name: cards
object_type: table
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-CREATE, FEAT-CARD-MOVE, FEAT-CARD-EDIT-DETAIL, FEAT-CARD-ARCHIVE]
  requirements: []
  business_rules: [BR-CARD-001, BR-CARD-002, BR-CARD-003, BR-LIST-002]
  screens: []
  flows: [FLOW-CARD-MOVE-DRAGDROP, FLOW-CARD-LIFECYCLE]
  apis: [API-CARD-CREATE, API-CARD-GET-DETAIL, API-CARD-UPDATE, API-CARD-MOVE, API-CARD-ARCHIVE]
  database_objects: [DB-LIST]
  tests: []
  decisions: [ADR-003, ADR-005]
---

# Database Object

## Purpose
The core work item: belongs to exactly one List at a time, ordered within it.

## Object
- Schema: `public`
- Name: `cards`
- Type: Table
- Owner Module: `MOD-CARD`

## Columns

| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| list_id | uuid | No | - | FK to `lists.id` — current owning List |
| board_id | uuid | No | - | FK to `boards.id` — denormalized for fast board-scoped queries and activity logging |
| title | text | No | - | Card title |
| description | text | Yes | null | Long-form markdown description |
| due_date | date | Yes | null | Optional due date (date-only, no time/timezone) |
| position | double precision | No | - | Fractional ordering key within the list (`ADR-003`) |
| created_by | uuid | No | - | FK to `users.id` |
| archived_at | timestamptz | Yes | null | Soft-delete marker |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit, used for optimistic concurrency on move/update |

## Primary Key
`id`

## Foreign Keys
- `list_id` -> `lists.id`
- `board_id` -> `boards.id`
- `created_by` -> `users.id`

## Unique / Check Constraints
- `CHECK (char_length(title) BETWEEN 1 AND 200)`

## Indexes

| Index | Columns | Unique | Purpose |
|---|---|---:|---|
| cards_list_id_position_idx | list_id, position | No | Ordered card retrieval within a list, filtered by `archived_at IS NULL` |
| cards_board_id_idx | board_id | No | Board-scoped queries (search/filter, future) |

## Read By
`API-BOARD-GET-DETAIL` (nested), `API-CARD-GET-DETAIL`.

## Written By
`API-CARD-CREATE` (insert), `API-CARD-UPDATE` (title/description/due_date), `API-CARD-MOVE` (`list_id`, `board_id`, `position`), `API-CARD-ARCHIVE` (`archived_at`).

## Lifecycle / Soft Delete
`archived_at` soft-delete (`ADR-005`); archived Cards are hidden from the board view (`BR-CARD-003`).

## Sensitive Data / Retention
`description`/comments may contain user-entered business-sensitive text; access is restricted to Board/Workspace members.

## Expected Volume / Growth
The highest-volume table in the system — hundreds to low thousands of Cards per active Board.

## Concurrency / Transaction Notes
`API-CARD-MOVE` is the most concurrency-sensitive write in the system: it updates `list_id`/`board_id`/`position` and inserts one `activity_log` row in a single transaction, using the client-supplied `updated_at` for an optimistic-concurrency check (`BR-CARD-001`, `FLOW-CARD-MOVE-DRAGDROP`).

## Migration / Backfill Notes
Depends on `lists` and `boards`.
