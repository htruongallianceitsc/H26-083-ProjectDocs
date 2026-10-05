---
code: DB-PASSWORD-RESET-TOKEN
type: database-object
title: Password Reset Token
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [database, auth, security]
object_name: password_reset_tokens
object_type: table
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-FORGOT-PASSWORD]
  requirements: []
  business_rules: [BR-AUTH-001]
  screens: []
  flows: []
  apis: [API-AUTH-FORGOT-PASSWORD, API-AUTH-RESET-PASSWORD]
  database_objects: [DB-USER]
  tests: []
  decisions: []
---

# Database Object

## Purpose
Stores hashed, single-use, short-lived tokens issued for the forgot-password flow.

## Object
- Schema: `public`
- Name: `password_reset_tokens`
- Type: Table
- Owner Module: `MOD-AUTH`

## Columns

| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | FK to `users.id` |
| token_hash | text | No | - | SHA-256 hash of the emailed token |
| expires_at | timestamptz | No | - | Typically 30 minutes from issuance |
| used_at | timestamptz | Yes | null | Set once the token is redeemed; a used token cannot be redeemed again |
| created_at | timestamptz | No | now() | Audit |

## Primary Key
`id`

## Foreign Keys
- `user_id` -> `users.id`

## Unique / Check Constraints
- `UNIQUE (token_hash)`

## Indexes

| Index | Columns | Unique | Purpose |
|---|---|---:|---|
| password_reset_tokens_token_hash_key | token_hash | Yes | Token lookup on reset |

## Read By
`API-AUTH-RESET-PASSWORD`.

## Written By
`API-AUTH-FORGOT-PASSWORD` (insert), `API-AUTH-RESET-PASSWORD` (`used_at`).

## Lifecycle / Soft Delete
Expired/used rows are retained briefly then purged by a periodic cleanup job.

## Sensitive Data / Retention
`token_hash` is a credential-equivalent value; never logged.

## Expected Volume / Growth
Low — only created when a user requests a password reset.

## Concurrency / Transaction Notes
`used_at IS NULL AND expires_at > now()` is checked and set atomically within one transaction to prevent double-redemption.

## Migration / Backfill Notes
Depends on `users`.
