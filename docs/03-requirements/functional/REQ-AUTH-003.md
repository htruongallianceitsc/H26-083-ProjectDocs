---
code: REQ-AUTH-003
type: requirement
title: Forgot and Reset Password
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth]
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-FORGOT-PASSWORD]
  requirements: []
  business_rules: [BR-AUTH-001]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-AUTH-FORGOT-PASSWORD-001]
  decisions: []
---

# Requirement

## Statement
The system must let a user who forgot their password request a single-use, time-limited reset link by email and use it to set a new password.

## Type
Functional

## Actor / Trigger
Anonymous visitor who owns the account email; triggered by the "Forgot password?" link.

## Expected Behaviour
The forgot-password request never reveals whether the email is registered; the reset link works exactly once within its validity window.

## Rationale / Source
Standard account-recovery requirement.

## Priority
P1

## Acceptance Criteria
- Given any submitted email, when the user requests a reset, then the response is always a generic success message.
- Given a valid, unused, unexpired token, when the user submits a new compliant password, then the password is updated and the token cannot be reused.
- Given an expired or already-used token, when the user tries to reset, then the request fails with `TOKEN_EXPIRED_OR_USED`.

## Dependencies
`INT-EMAIL`

## Related Business Rules
`BR-AUTH-001`

## Verification
`TC-AUTH-FORGOT-PASSWORD-001`
