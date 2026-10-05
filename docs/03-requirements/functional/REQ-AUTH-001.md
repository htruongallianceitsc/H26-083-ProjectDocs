---
code: REQ-AUTH-001
type: requirement
title: User Registration
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth]
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-REGISTER]
  requirements: []
  business_rules: [BR-AUTH-001]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-AUTH-REGISTER-001]
  decisions: []
---

# Requirement

## Statement
The system must let any visitor create an account with a unique email, a policy-compliant password, and a display name.

## Type
Functional

## Actor / Trigger
Anonymous visitor; triggered by submitting the registration form.

## Expected Behaviour
On success, the account is created and the visitor is immediately authenticated (session issued).

## Rationale / Source
Required entry point for all other functionality.

## Priority
P0

## Acceptance Criteria
- Given a unique email and compliant password, when the visitor registers, then an account is created and a session is returned.
- Given an email already in use, when the visitor registers, then the request fails with `EMAIL_ALREADY_EXISTS`.

## Dependencies
None.

## Related Business Rules
`BR-AUTH-001`

## Verification
`TC-AUTH-REGISTER-001`
