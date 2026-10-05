---
code: TC-AUTH-LOGIN-001
type: test-case
title: Account locks out after 5 failed login attempts
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth, test]
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-LOGIN]
  requirements: [REQ-AUTH-002]
  business_rules: [BR-AUTH-002]
  screens: []
  flows: [FLOW-AUTH-LOGIN]
  apis: [API-AUTH-LOGIN]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify the account-lockout rule triggers after 5 consecutive failed attempts and that a correct login succeeds beforehand and after the lockout window.

## Verifies
`REQ-AUTH-002`, `BR-AUTH-002`, `API-AUTH-LOGIN`

## Preconditions
Registered account `jane@example.com` / `Passw0rd`.

## Test Data
Wrong password: `WrongPass1`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | POST `/api/auth/login` with wrong password, 5 times in a row | Each returns `401 INVALID_CREDENTIALS` |
| 2 | POST `/api/auth/login` with the CORRECT password immediately after | `423 ACCOUNT_LOCKED` |
| 3 | Wait 15 minutes (or advance test clock), POST with correct password | `200 OK`, session returned |

## Postconditions
Failed-attempt counter reset after successful login.

## Priority
P0

## Automation Candidate
Yes — API integration test with a mockable clock.

## Notes
Also verify `API-AUTH-LOGOUT` revokes the refresh token (a subsequent protected request with the old access token after its natural expiry fails).
