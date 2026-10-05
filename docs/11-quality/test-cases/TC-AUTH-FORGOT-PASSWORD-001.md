---
code: TC-AUTH-FORGOT-PASSWORD-001
type: test-case
title: Reset password with a valid token, then reject reuse
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth, test]
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-FORGOT-PASSWORD]
  requirements: [REQ-AUTH-003]
  business_rules: [BR-AUTH-001]
  screens: []
  flows: []
  apis: [API-AUTH-FORGOT-PASSWORD, API-AUTH-RESET-PASSWORD]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify the full forgot/reset password flow and single-use token enforcement.

## Verifies
`REQ-AUTH-003`, `BR-AUTH-001`, `API-AUTH-FORGOT-PASSWORD`, `API-AUTH-RESET-PASSWORD`

## Preconditions
Registered account `jane@example.com`.

## Test Data
New password: `NewPassw0rd`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | POST `/api/auth/forgot-password` with `jane@example.com` | `200 OK` generic message; one token row created |
| 2 | POST `/api/auth/forgot-password` with a non-existent email | `200 OK`, identical generic message |
| 3 | POST `/api/auth/reset-password` with the issued token and `NewPassw0rd` | `200 OK`, password updated |
| 4 | POST `/api/auth/reset-password` again with the SAME token | `410 TOKEN_EXPIRED_OR_USED` |
| 5 | POST `/api/auth/login` with the new password | `200 OK` |

## Postconditions
Old password no longer works; token marked used.

## Priority
P1

## Automation Candidate
Yes — API integration test; requires intercepting the outbound email or reading the token directly from the test database.

## Notes
Step 2 is the key anti-enumeration assertion: response body/status must be indistinguishable from step 1.
