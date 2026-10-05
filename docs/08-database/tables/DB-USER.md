---
code: DB-USER
type: database-object
title: User
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [database, auth]
object_name: users
object_type: table
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-REGISTER, FEAT-AUTH-LOGIN]
  requirements: []
  business_rules: [BR-AUTH-001]
  screens: []
  flows: []
  apis: [API-AUTH-REGISTER, API-AUTH-LOGIN]
  database_objects: []
  tests: []
  decisions: []
---

# Database Object

## Purpose
Stores one row per registered account: credentials (hashed) and profile basics used across the whole system (display name, avatar).

## Object
- Schema: `public`
- Name: `users`
- Type: Table
- Owner Module: `MOD-AUTH`

## Columns

| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| email | text | No | - | Unique login identifier |
| password_hash | text | No | - | bcrypt/argon2 password hash, never returned by any API |
| display_name | text | No | - | Name shown on cards/comments/avatars |
| avatar_url | text | Yes | null | Optional profile image URL |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit |

## Primary Key
`id`

## Foreign Keys
None (root entity).

## Unique / Check Constraints
- `UNIQUE (email)`
- `CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')` (basic format guard; full validation happens in the API layer)

## Indexes

| Index | Columns | Unique | Purpose |
|---|---|---:|---|
| users_email_key | email | Yes | Login lookup, uniqueness |

## Read By
`API-AUTH-LOGIN`, `API-BOARD-GET-DETAIL` (to resolve member display names), `API-CARD-GET-DETAIL`, `API-COMMENT-CREATE` response hydration.

## Written By
`API-AUTH-REGISTER` (insert), `API-AUTH-RESET-PASSWORD` (update `password_hash`).

## Lifecycle / Soft Delete
No soft delete in v1 — account deactivation/deletion is not in scope (see `docs/19-open-items/open-questions.md` for future consideration).

## Sensitive Data / Retention
`password_hash` is sensitive; never logged or returned in any API response (`docs/10-security/data-security.md`). `email` is personal data.

## Expected Volume / Growth
Low thousands of rows for the MVP target audience; grows linearly with account signups.

## Concurrency / Transaction Notes
`email` uniqueness enforced at the database level to prevent race conditions on concurrent registration attempts.

## Migration / Backfill Notes
Initial migration creates this table before all others (every other table references `users.id` directly or indirectly).
