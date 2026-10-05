---
code: REQ-AUTH-002
type: requirement
title: Login and Logout
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth]
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-LOGIN]
  requirements: []
  business_rules: [BR-AUTH-002]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-AUTH-LOGIN-001]
  decisions: [ADR-002]
---

# Requirement

## Statement
The system must let a registered user sign in with email/password to obtain a session, and sign out to end it.

## Type
Functional

## Actor / Trigger
Registered user; triggered by submitting login credentials or clicking sign out.

## Expected Behaviour
Correct credentials on a non-locked account return a valid session (`ADR-002`); logout revokes the session's refresh token.

## Rationale / Source
Required for every authenticated feature in the system.

## Priority
P0

## Acceptance Criteria
- Given correct credentials, when the user logs in, then a session is issued.
- Given 5 consecutive wrong-password attempts within 15 minutes, when the user tries again, then the account is locked (`BR-AUTH-002`).
- Given an active session, when the user logs out, then the refresh token is revoked and subsequent refresh attempts fail.

## Dependencies
`FEAT-AUTH-REGISTER`

## Related Business Rules
`BR-AUTH-002`

## Verification
`TC-AUTH-LOGIN-001`
