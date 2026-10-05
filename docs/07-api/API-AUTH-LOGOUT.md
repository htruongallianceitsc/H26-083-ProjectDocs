---
code: API-AUTH-LOGOUT
type: api
title: Logout
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, auth]
method: POST
path: /api/auth/logout
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-LOGIN]
  requirements: [REQ-AUTH-002]
  business_rules: []
  screens: [SCR-LOGIN]
  flows: []
  apis: []
  database_objects: [DB-REFRESH-TOKEN]
  tests: [TC-AUTH-LOGIN-001]
  decisions: [ADR-002]
---

# API Contract

## Purpose
End the current session by revoking its refresh token.

## Endpoint
- Method: `POST`
- Path: `/api/auth/logout`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required (or at minimum a valid refresh-token cookie).

## Request
### Headers
`Authorization: Bearer <token>`
### Path Parameters
None
### Query Parameters
None
### Body
None

## Response
### Success
`204 No Content`. Clears the `refresh_token` cookie.
### Errors
- `401 UNAUTHENTICATED`

## Validation
None.

## Business Rules Applied
None.

## Idempotency / Concurrency
Idempotent: logging out twice is harmless (second call finds no active token to revoke and still returns `204`).

## Transaction Boundary
Single-row update (`revoked_at`).

## Database Impact
### READ
`DB-REFRESH-TOKEN` (lookup by token hash)
### WRITE
`DB-REFRESH-TOKEN` (set `revoked_at`)

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard rate limit.

## Related Feature / Screen / Tests
`FEAT-AUTH-LOGIN`, `SCR-LOGIN`, `TC-AUTH-LOGIN-001`
