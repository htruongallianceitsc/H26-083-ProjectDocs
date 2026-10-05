---
code: DB-BOARD
type: database-object
title: Board
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [database, board]
object_name: boards
object_type: table
related:
  modules: [MOD-BOARD]
  features: [FEAT-BOARD-CREATE, FEAT-BOARD-MANAGE]
  requirements: []
  business_rules: [BR-BOARD-001, BR-BOARD-002]
  screens: []
  flows: []
  apis: [API-BOARD-CREATE, API-BOARD-GET-DETAIL, API-BOARD-UPDATE, API-BOARD-ARCHIVE]
  database_objects: [DB-WORKSPACE]
  tests: []
  decisions: [ADR-005]
---

# Database Object

## Purpose
A single kanban board owned by a Workspace.

## Object
- Schema: `public`
- Name: `boards`
- Type: Table
- Owner Module: `MOD-BOARD`

## Columns

| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| workspace_id | uuid | No | - | FK to `workspaces.id` |
| title | text | No | - | Board display name |
| background | text | No | 'default-blue' | Background color/image token |
| visibility | text | No | 'workspace' | `workspace` (all workspace members) or `private` (explicit board members only — future) |
| is_starred | boolean | No | false | Per-creator convenience flag (future: move to per-user table if multi-user starring is needed) |
| created_by | uuid | No | - | FK to `users.id` |
| archived_at | timestamptz | Yes | null | Soft-delete marker (`ADR-005`) |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit |

## Primary Key
`id`

## Foreign Keys
- `workspace_id` -> `workspaces.id`
- `created_by` -> `users.id`

## Unique / Check Constraints
- `CHECK (char_length(title) BETWEEN 1 AND 100)`
- `CHECK (visibility IN ('workspace','private'))`

## Indexes

| Index | Columns | Unique | Purpose |
|---|---|---:|---|
| boards_workspace_id_idx | workspace_id | No | List boards by workspace, filtered by `archived_at IS NULL` |

## Read By
`API-WORKSPACE-LIST` (board count), `API-BOARD-GET-DETAIL`, board list screen (`SCR-WORKSPACE-HOME`).

## Written By
`API-BOARD-CREATE` (insert), `API-BOARD-UPDATE` (title/background/visibility/star), `API-BOARD-ARCHIVE` (sets `archived_at`).

## Lifecycle / Soft Delete
`archived_at` soft-delete per `ADR-005`; archived boards are excluded from `SCR-WORKSPACE-HOME` by default and become read-only (`BR-BOARD-002`).

## Sensitive Data / Retention
None beyond workspace-level access control.

## Expected Volume / Growth
Tens of boards per active workspace.

## Concurrency / Transaction Notes
`API-BOARD-CREATE` creates the Board and its default Lists in one transaction.

## Migration / Backfill Notes
Depends on `workspaces` and `users`.
