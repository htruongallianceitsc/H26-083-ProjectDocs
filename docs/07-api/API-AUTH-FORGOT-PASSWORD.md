---
code: API-AUTH-FORGOT-PASSWORD
type: api
title: Forgot Password (Request Reset)
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, auth]
method: POST
path: /api/auth/forgot-password
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-FORGOT-PASSWORD]
  requirements: [REQ-AUTH-003]
  business_rules: []
  screens: [SCR-FORGOT-PASSWORD]
  flows: []
  apis: []
  database_objects: [DB-USER, DB-PASSWORD-RESET-TOKEN]
  tests: [TC-AUTH-FORGOT-PASSWORD-001]
  decisions: []
---

# API Contract

## Purpose
Request a password-reset email for a given address.

## Endpoint
- Method: `POST`
- Path: `/api/auth/forgot-password`
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
{ "email": "jane@example.com" }
```

## Response
### Success
`200 OK`
```json
{ "data": { "message": "If that email is registered, a reset link has been sent." } }
```
Always returns this response regardless of whether the email matches an account (anti-enumeration).
### Errors
- `400 VALIDATION_ERROR` (malformed email only)

## Validation
`email` required, valid format.

## Business Rules Applied
Anti-enumeration behaviour documented here (not a numbered `BR-*`, enforced structurally by always returning the same response).

## Idempotency / Concurrency
Each call creates a new token row; calling repeatedly is safe (multiple valid tokens may coexist, see `FEAT-AUTH-FORGOT-PASSWORD` known limitations).

## Transaction Boundary
Lookup user by email; if found, insert one `DB-PASSWORD-RESET-TOKEN` row and enqueue the email send.

## Database Impact
### READ
`DB-USER`
### WRITE
`DB-PASSWORD-RESET-TOKEN` (insert, only if the email matches a user)

## External Dependencies
`INT-EMAIL` (transactional email send).

## Logging / Audit
Standard request logging; raw token never logged.

## Performance / Rate Limit
Rate-limited per email/IP to prevent email-bombing a target address.

## Related Feature / Screen / Tests
`FEAT-AUTH-FORGOT-PASSWORD`, `SCR-FORGOT-PASSWORD`, `TC-AUTH-FORGOT-PASSWORD-001`
