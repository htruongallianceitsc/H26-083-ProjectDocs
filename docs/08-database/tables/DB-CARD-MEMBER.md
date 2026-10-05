---
code: DB-CARD-MEMBER
type: database-object
title: Card Member
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [database, card, member]
object_name: card_members
object_type: table
related:
  modules: [MOD-MEMBER]
  features: [FEAT-MEMBER-ASSIGN-CARD]
  requirements: []
  business_rules: [BR-MEMBER-001]
  screens: []
  flows: []
  apis: [API-CARD-MEMBER-ASSIGN, API-CARD-MEMBER-REMOVE]
  database_objects: [DB-CARD, DB-USER]
  tests: []
  decisions: []
---

# Database Object

## Purpose
Join table assigning Workspace/Board members to a Card as responsible parties.

## Object
- Schema: `public`
- Name: `card_members`
- Type: Table
- Owner Module: `MOD-MEMBER`

## Columns

| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| card_id | uuid | No | - | FK to `cards.id` |
| user_id | uuid | No | - | FK to `users.id` |
| assigned_by | uuid | No | - | FK to `users.id`, who performed the assignment |
| created_at | timestamptz | No | now() | Audit (assignment date) |

## Primary Key
`id`

## Foreign Keys
- `card_id` -> `cards.id`
- `user_id` -> `users.id`
- `assigned_by` -> `users.id`

## Unique / Check Constraints
- `UNIQUE (card_id, user_id)`

## Indexes

| Index | Columns | Unique | Purpose |
|---|---|---:|---|
| card_members_card_id_user_id_key | card_id, user_id | Yes | Prevent duplicate assignment, fast card-member lookup |

## Read By
`API-CARD-GET-DETAIL`, `API-BOARD-GET-DETAIL` (avatar chips).

## Written By
`API-CARD-MEMBER-ASSIGN` (insert), `API-CARD-MEMBER-REMOVE` (delete).

## Lifecycle / Soft Delete
Hard delete on unassignment; the activity log records the historical event (`DB-ACTIVITY-LOG`).

## Sensitive Data / Retention
None beyond standard access control.

## Expected Volume / Growth
A few rows per Card on average.

## Concurrency / Transaction Notes
`UNIQUE (card_id, user_id)` prevents duplicate concurrent assignment.

## Migration / Backfill Notes
Depends on `cards` and `users`.
