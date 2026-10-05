---
code: TC-AUTH-REGISTER-001
type: test-case
title: Register with duplicate email is rejected
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth, test]
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-REGISTER]
  requirements: [REQ-AUTH-001]
  business_rules: [BR-AUTH-001]
  screens: []
  flows: []
  apis: [API-AUTH-REGISTER]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify registration enforces email uniqueness and password policy.

## Verifies
`REQ-AUTH-001`, `BR-AUTH-001`, `API-AUTH-REGISTER`

## Preconditions
An account with email `jane@example.com` already exists.

## Test Data
`{ "email": "jane@example.com", "password": "Passw0rd", "displayName": "Jane 2" }`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | POST `/api/auth/register` with the test data above | `409 EMAIL_ALREADY_EXISTS` |
| 2 | POST with a unique email but password `"short1"` | `400 VALIDATION_ERROR` |
| 3 | POST with a unique email and password `"Passw0rd"` | `201 Created`, session returned |

## Postconditions
Exactly one new user row created (step 3 only).

## Priority
P0

## Automation Candidate
Yes — API integration test.

## Notes
None.
