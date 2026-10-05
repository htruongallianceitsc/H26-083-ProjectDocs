---
code: BR-AUTH-002
type: business-rule
title: Account Lockout After Failed Logins
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth, security]
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-LOGIN]
  requirements: [REQ-AUTH-002]
  business_rules: []
  screens: [SCR-LOGIN]
  flows: []
  apis: [API-AUTH-LOGIN]
  database_objects: [DB-USER]
  tests: [TC-AUTH-LOGIN-001]
  decisions: []
---

# Business Rule

## Rule Statement
After 5 consecutive failed login attempts for the same email within a 15-minute window, further login attempts for that email are blocked for 15 minutes.

## Conditions
Tracked per-email (not per-IP) on `API-AUTH-LOGIN`. The failure counter resets on a successful login or after the 15-minute window elapses since the first counted failure.

## Result / Constraint
Login attempts during lockout return `423 ACCOUNT_LOCKED` without indicating whether the supplied password would otherwise have been correct.

## Exceptions
None in v1 (no admin override / unlock endpoint yet).

## Scope / Effective Context
`API-AUTH-LOGIN` only.

## Positive Examples
4 failed attempts followed by the correct password on the 5th try succeeds and resets the counter.

## Negative Examples
5 failed attempts within 10 minutes, then a 6th attempt (even with the correct password) within the lockout window returns `ACCOUNT_LOCKED`.

## Error / Message
`ACCOUNT_LOCKED` — "Too many failed attempts. Try again in a few minutes."

## Affected Features / Requirements / APIs / Screens
`FEAT-AUTH-LOGIN`, `REQ-AUTH-002`, `API-AUTH-LOGIN`, `SCR-LOGIN`

## Test Coverage
`TC-AUTH-LOGIN-001`
