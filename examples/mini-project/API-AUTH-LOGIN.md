---
code: API-AUTH-LOGIN
type: api
title: Login API
status: approved
related:
  features: [FEAT-AUTH-LOGIN]
  business_rules: [BR-AUTH-001]
  database_objects: [DB-USER]
---
# Login API

- Method: POST
- Path: `/api/auth/login`
- Auth: Public

## Request
```json
{"email":"user@example.com","password":"***"}
```

## Success
Returns authentication token/session metadata.

## Business Rules
- `BR-AUTH-001`

## Database
READ: `DB-USER`

## Audit
Log success/failure outcome without logging password.
