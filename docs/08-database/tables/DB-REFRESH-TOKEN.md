---
code: DB-REFRESH-TOKEN
type: database-object
title: Refresh Token
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [database, auth, security]
object_name: refresh_tokens
object_type: table
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-LOGIN]
  requirements: []
  business_rules: []
  screens: []
  flows: [FLOW-AUTH-LOGIN]
  apis: [API-AUTH-LOGIN, API-AUTH-LOGOUT]
  database_objects: [DB-USER]
  tests: []
  decisions: [ADR-002]
---

# Database Object

## Purpose
Stores hashed long-lived refresh tokens used to mint new short-lived JWT access tokens without re-prompting login (`ADR-002`).

## Object
- Schema: `public`
- Name: `refresh_tokens`
- Type: Table
- Owner Module: `MOD-AUTH`

## Columns

| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | FK to `users.id` |
| token_hash | text | No | - | SHA-256 hash of the refresh token (raw token never stored) |
| expires_at | timestamptz | No | - | Expiry (see `NFR-SEC-001`) |
| revoked_at | timestamptz | Yes | null | Set on logout or rotation |
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
| refresh_tokens_token_hash_key | token_hash | Yes | Token lookup on refresh |
| refresh_tokens_user_id_idx | user_id | No | Revoke-all-sessions lookup |

## Read By
`API-AUTH-LOGIN` (implicit refresh flow, not detailed as a separate endpoint in v1), `API-AUTH-LOGOUT`.

## Written By
`API-AUTH-LOGIN` (insert), `API-AUTH-LOGOUT` (`revoked_at`).

## Lifecycle / Soft Delete
Expired/revoked rows are retained for a short audit window then purged by a periodic cleanup job (operational detail, not yet specified).

## Sensitive Data / Retention
`token_hash` is a credential; never logged. The raw token is only ever held client-side (httpOnly cookie, see `docs/10-security/authentication.md`).

## Expected Volume / Growth
One row per active session; grows and shrinks with login/logout activity.

## Concurrency / Transaction Notes
None beyond standard single-row writes.

## Migration / Backfill Notes
Depends on `users`.
