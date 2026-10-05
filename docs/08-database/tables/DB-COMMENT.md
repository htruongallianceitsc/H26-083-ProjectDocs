---
code: DB-COMMENT
type: database-object
title: Comment
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [database, comment]
object_name: comments
object_type: table
related:
  modules: [MOD-COMMENT]
  features: [FEAT-COMMENT-ADD]
  requirements: []
  business_rules: [BR-COMMENT-001]
  screens: []
  flows: [FLOW-COMMENT-ACTIVITY]
  apis: [API-COMMENT-CREATE, API-COMMENT-UPDATE, API-COMMENT-DELETE]
  database_objects: [DB-CARD]
  tests: []
  decisions: [ADR-005]
---

# Database Object

## Purpose
A single comment posted on a Card.

## Object
- Schema: `public`
- Name: `comments`
- Type: Table
- Owner Module: `MOD-COMMENT`

## Columns

| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| card_id | uuid | No | - | FK to `cards.id` |
| author_id | uuid | No | - | FK to `users.id` |
| body | text | No | - | Comment text (markdown) |
| edited_at | timestamptz | Yes | null | Set when the comment is edited after creation |
| deleted_at | timestamptz | Yes | null | Soft-delete marker |
| created_at | timestamptz | No | now() | Audit |

## Primary Key
`id`

## Foreign Keys
- `card_id` -> `cards.id`
- `author_id` -> `users.id`

## Unique / Check Constraints
- `CHECK (char_length(body) BETWEEN 1 AND 5000)`

## Indexes

| Index | Columns | Unique | Purpose |
|---|---|---:|---|
| comments_card_id_created_at_idx | card_id, created_at | No | Chronological comment thread retrieval |

## Read By
`API-CARD-GET-DETAIL` (comment thread).

## Written By
`API-COMMENT-CREATE` (insert), `API-COMMENT-UPDATE` (`body`, `edited_at`), `API-COMMENT-DELETE` (`deleted_at`).

## Lifecycle / Soft Delete
`deleted_at` soft-delete; a deleted comment is replaced with a tombstone placeholder in the UI rather than physically removed (`BR-COMMENT-001`).

## Sensitive Data / Retention
Comment `body` is user-generated content that may contain business-sensitive text.

## Expected Volume / Growth
Potentially the highest row-count table over time as comment history accumulates per card.

## Concurrency / Transaction Notes
`API-COMMENT-CREATE` inserts the comment and an `activity_log` row in one transaction (`FLOW-COMMENT-ACTIVITY`).

## Migration / Backfill Notes
Depends on `cards` and `users`.
