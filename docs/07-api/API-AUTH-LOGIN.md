---
code: API-AUTH-LOGIN
type: api
title: Login
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, auth]
method: POST
path: /api/auth/login
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-LOGIN]
  requirements: [REQ-AUTH-002]
  business_rules: [BR-AUTH-002]
  screens: [SCR-LOGIN]
  flows: [FLOW-AUTH-LOGIN]
  apis: []
  database_objects: [DB-USER, DB-REFRESH-TOKEN]
  tests: [TC-AUTH-LOGIN-001]
  decisions: [ADR-002]
---

# API Contract

## Purpose
Authenticate a user and issue a new session.

## Endpoint
- Method: `POST`
- Path: `/api/auth/login`
- Version: `v1`

## Authentication / Authorization
None (anonymous).

## Request
### Headers
`Content-Type: application/json`
### Path Parameters
None
### Query Parameters
None
### Body
```json
{ "email": "jane@example.com", "password": "Passw0rd" }
```

## Response
### Success
`200 OK`
```json
{ "data": { "user": { "id": "uuid", "email": "jane@example.com", "displayName": "Jane Doe" }, "accessToken": "jwt..." } }
```
Sets `refresh_token` as an httpOnly, `SameSite=Strict`, `Secure` cookie.
### Errors
- `400 VALIDATION_ERROR`
- `401 INVALID_CREDENTIALS`
- `423 ACCOUNT_LOCKED` (`BR-AUTH-002`)

## Validation
`email`/`password` required.

## Business Rules Applied
`BR-AUTH-002`

## Idempotency / Concurrency
Not idempotent — each successful call issues a new refresh token row.

## Transaction Boundary
Credential check (read), failed-attempt counter update, and (on success) `DB-REFRESH-TOKEN` insert.

## Database Impact
### READ
`DB-USER`
### WRITE
`DB-REFRESH-TOKEN` (insert on success); failed-attempt counter storage (in-memory/cache layer, not a persistent table, per `BR-AUTH-002`)

## External Dependencies
None.

## Logging / Audit
Failed attempts counted per email; password never logged.

## Performance / Rate Limit
Rate-limited per IP and per email to mitigate credential stuffing, in addition to the account-lockout rule.

## Related Feature / Screen / Tests
`FEAT-AUTH-LOGIN`, `SCR-LOGIN`, `TC-AUTH-LOGIN-001`
