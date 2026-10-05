---
code: DB-ACTIVITY-LOG
type: database-object
title: Activity Log
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [database, activity, audit]
object_name: activity_log
object_type: table
related:
  modules: [MOD-COMMENT]
  features: [FEAT-ACTIVITY-LOG]
  requirements: []
  business_rules: []
  screens: []
  flows: [FLOW-COMMENT-ACTIVITY, FLOW-CARD-MOVE-DRAGDROP]
  apis: [API-ACTIVITY-LIST]
  database_objects: [DB-CARD, DB-BOARD]
  tests: []
  decisions: []
---

# Database Object

## Purpose
Append-only history of notable actions on a Card (created, moved, labeled, member assigned, commented, archived), rendered as the Card's activity feed.

## Object
- Schema: `public`
- Name: `activity_log`
- Type: Table
- Owner Module: `MOD-COMMENT`

## Columns

| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| card_id | uuid | No | - | FK to `cards.id` |
| board_id | uuid | No | - | FK to `boards.id`, denormalized for potential future board-level activity views |
| actor_id | uuid | No | - | FK to `users.id`, who performed the action |
| action_type | text | No | - | e.g. `card_created`, `card_moved`, `card_archived`, `label_assigned`, `member_assigned`, `comment_added` |
| metadata | jsonb | No | '{}' | Action-specific structured detail (e.g. `{"from_list_id":...,"to_list_id":...}`) |
| created_at | timestamptz | No | now() | When the action occurred |

## Primary Key
`id`

## Foreign Keys
- `card_id` -> `cards.id`
- `board_id` -> `boards.id`
- `actor_id` -> `users.id`

## Unique / Check Constraints
None beyond `NOT NULL` on required columns.

## Indexes

| Index | Columns | Unique | Purpose |
|---|---|---:|---|
| activity_log_card_id_created_at_idx | card_id, created_at | No | Chronological activity feed per card |

## Read By
`API-ACTIVITY-LIST` (card activity feed, rendered in `SCR-CARD-DETAIL`).

## Written By
Every write-side API that changes card state inserts a row here as part of the same transaction: `API-CARD-CREATE`, `API-CARD-MOVE`, `API-CARD-ARCHIVE`, `API-LABEL-ASSIGN`/`API-LABEL-REMOVE`, `API-CARD-MEMBER-ASSIGN`/`API-CARD-MEMBER-REMOVE`, `API-COMMENT-CREATE`.

## Lifecycle / Soft Delete
Append-only; no update/delete path in v1.

## Sensitive Data / Retention
`metadata` may contain references to other entities but no raw user content beyond IDs; comment text itself lives in `comments`, not duplicated here.

## Expected Volume / Growth
Grows continuously with usage; the single fastest-growing table. Retention/archival policy is a future operational decision (see `docs/13-operations/monitoring.md`).

## Concurrency / Transaction Notes
Always inserted in the same transaction as the state-changing write it records, so the activity feed is never out of sync with the state it describes.

## Migration / Backfill Notes
Depends on `cards`, `boards`, `users`.
