---
code: API-AUTH-REGISTER
type: api
title: Register
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, auth]
method: POST
path: /api/auth/register
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-REGISTER]
  requirements: [REQ-AUTH-001]
  business_rules: [BR-AUTH-001]
  screens: [SCR-REGISTER]
  flows: []
  apis: []
  database_objects: [DB-USER]
  tests: [TC-AUTH-REGISTER-001]
  decisions: [ADR-002]
---

# API Contract

## Purpose
Create a new user account and immediately issue a session.

## Endpoint
- Method: `POST`
- Path: `/api/auth/register`
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
{ "email": "jane@example.com", "password": "Passw0rd", "displayName": "Jane Doe" }
```

## Response
### Success
`201 Created`
```json
{ "data": { "user": { "id": "uuid", "email": "jane@example.com", "displayName": "Jane Doe" }, "accessToken": "jwt..." } }
```
Sets `refresh_token` as an httpOnly, `SameSite=Strict`, `Secure` cookie.
### Errors
- `400 VALIDATION_ERROR`
- `409 EMAIL_ALREADY_EXISTS`

## Validation
`email`: required, valid format, case-insensitively unique. `password`: per `BR-AUTH-001`. `displayName`: required, 1-80 chars.

## Business Rules Applied
`BR-AUTH-001`

## Idempotency / Concurrency
Not idempotent (creates a new resource); the `UNIQUE (email)` constraint prevents duplicate concurrent registration with the same email.

## Transaction Boundary
Single-row insert into `DB-USER`.

## Database Impact
### READ
`DB-USER` (uniqueness check)
### WRITE
`DB-USER` (insert), `DB-REFRESH-TOKEN` (insert, for the issued session)

## External Dependencies
None.

## Logging / Audit
Standard request logging; password never logged.

## Performance / Rate Limit
Rate-limited per IP to deter automated account creation (e.g. 10/hour).

## Related Feature / Screen / Tests
`FEAT-AUTH-REGISTER`, `SCR-REGISTER`, `TC-AUTH-REGISTER-001`
