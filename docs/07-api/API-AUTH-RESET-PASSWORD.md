---
code: API-AUTH-RESET-PASSWORD
type: api
title: Reset Password
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, auth]
method: POST
path: /api/auth/reset-password
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-FORGOT-PASSWORD]
  requirements: [REQ-AUTH-003]
  business_rules: [BR-AUTH-001]
  screens: [SCR-FORGOT-PASSWORD]
  flows: []
  apis: []
  database_objects: [DB-USER, DB-PASSWORD-RESET-TOKEN]
  tests: [TC-AUTH-FORGOT-PASSWORD-001]
  decisions: []
---

# API Contract

## Purpose
Redeem a password-reset token to set a new password.

## Endpoint
- Method: `POST`
- Path: `/api/auth/reset-password`
- Version: `v1`

## Authentication / Authorization
None (anonymous; the token itself is the credential).

## Request
### Headers
`Content-Type: application/json`
### Path Parameters
None
### Query Parameters
None
### Body
```json
{ "token": "raw-token-from-email", "newPassword": "NewPassw0rd" }
```

## Response
### Success
`200 OK`
```json
{ "data": { "message": "Password updated. You can now log in." } }
```
### Errors
- `400 VALIDATION_ERROR`
- `410 TOKEN_EXPIRED_OR_USED`

## Validation
`newPassword` per `BR-AUTH-001`. `token` required.

## Business Rules Applied
`BR-AUTH-001`

## Idempotency / Concurrency
Not idempotent after first success (token becomes used); the `used_at IS NULL AND expires_at > now()` check and `used_at` update happen atomically to prevent double-redemption under concurrent requests.

## Transaction Boundary
Validate token, update `DB-USER.password_hash`, and set `DB-PASSWORD-RESET-TOKEN.used_at`, all in one transaction.

## Database Impact
### READ
`DB-PASSWORD-RESET-TOKEN`
### WRITE
`DB-USER` (`password_hash`), `DB-PASSWORD-RESET-TOKEN` (`used_at`)

## External Dependencies
None.

## Logging / Audit
Standard request logging; raw token and new password never logged.

## Performance / Rate Limit
Standard write-endpoint rate limit.

## Related Feature / Screen / Tests
`FEAT-AUTH-FORGOT-PASSWORD`, `SCR-FORGOT-PASSWORD`, `TC-AUTH-FORGOT-PASSWORD-001`
