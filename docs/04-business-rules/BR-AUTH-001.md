---
code: BR-AUTH-001
type: business-rule
title: Password Policy
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth, security]
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-REGISTER, FEAT-AUTH-FORGOT-PASSWORD]
  requirements: [REQ-AUTH-001, REQ-AUTH-003]
  business_rules: []
  screens: []
  flows: []
  apis: [API-AUTH-REGISTER, API-AUTH-RESET-PASSWORD]
  database_objects: [DB-USER]
  tests: [TC-AUTH-REGISTER-001]
  decisions: []
---

# Business Rule

## Rule Statement
A password must be at least 8 characters long and contain at least one letter and one digit. Passwords are stored only as a bcrypt hash (cost factor 12); the raw value is never persisted or logged.

## Conditions
Applies whenever a password is set: registration (`API-AUTH-REGISTER`) and password reset (`API-AUTH-RESET-PASSWORD`).

## Result / Constraint
A request with a non-compliant password is rejected before any database write.

## Exceptions
None.

## Scope / Effective Context
All password-setting endpoints.

## Positive Examples
`Passw0rd`, `summer2026`

## Negative Examples
`short1` (too short), `alllettersnonumber` (no digit), `12345678` (no letter)

## Error / Message
`VALIDATION_ERROR` with field detail `{ "password": "Must be at least 8 characters and include a letter and a number." }`

## Affected Features / Requirements / APIs / Screens
`FEAT-AUTH-REGISTER`, `FEAT-AUTH-FORGOT-PASSWORD`, `REQ-AUTH-001`, `REQ-AUTH-003`, `API-AUTH-REGISTER`, `API-AUTH-RESET-PASSWORD`

## Test Coverage
`TC-AUTH-REGISTER-001`
