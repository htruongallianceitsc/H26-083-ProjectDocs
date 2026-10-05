---
code: DB-WORKSPACE
type: database-object
title: Workspace
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [database, workspace]
object_name: workspaces
object_type: table
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-CREATE]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: [API-WORKSPACE-CREATE, API-WORKSPACE-LIST]
  database_objects: [DB-USER]
  tests: []
  decisions: []
---

# Database Object

## Purpose
Top-level tenant boundary that owns Boards and has its own membership list.

## Object
- Schema: `public`
- Name: `workspaces`
- Type: Table
- Owner Module: `MOD-WORKSPACE`

## Columns

| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| name | text | No | - | Workspace display name |
| created_by | uuid | No | - | FK to `users.id`, the creator / initial owner |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit |

## Primary Key
`id`

## Foreign Keys
- `created_by` -> `users.id`

## Unique / Check Constraints
- `CHECK (char_length(name) BETWEEN 1 AND 100)`

## Indexes

| Index | Columns | Unique | Purpose |
|---|---|---:|---|
| workspaces_created_by_idx | created_by | No | List workspaces created by a user |

## Read By
`API-WORKSPACE-LIST`, `API-BOARD-CREATE` (ownership check).

## Written By
`API-WORKSPACE-CREATE` (insert).

## Lifecycle / Soft Delete
No archive/delete in v1; a Workspace is permanent once created.

## Sensitive Data / Retention
None beyond standard access control.

## Expected Volume / Growth
Low — typically one workspace per team/company, growing slowly.

## Concurrency / Transaction Notes
Creating a Workspace and inserting the creator as `owner` into `workspace_members` happen in one transaction (see `API-WORKSPACE-CREATE`).

## Migration / Backfill Notes
Depends on `users` existing first.
