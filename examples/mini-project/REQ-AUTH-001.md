---
code: REQ-AUTH-001
type: requirement
title: Registered user can sign in
status: approved
related:
  features: [FEAT-AUTH-LOGIN]
  tests: [TC-AUTH-LOGIN-001, TC-AUTH-LOGIN-002]
---
# Requirement

A registered and active user can authenticate using a valid email/password pair.

## Acceptance Criteria
- Given an active user with valid credentials, when login is submitted, then authentication succeeds.
- Given invalid credentials, when login is submitted, then authentication fails without revealing which credential was wrong.
