---
code: REQ-AUTH-LOGIN-001
type: requirement
title: User can authenticate with valid credentials
status: draft
owner: {{OWNER}}
created_at: {{IMPORT_DATE}}
updated_at: {{IMPORT_DATE}}
last_reviewed_at: {{IMPORT_DATE}}
tags: [auth, reusable-capability]
related:
  features: [FEAT-AUTH-LOGIN]
  screens: [SCR-AUTH-LOGIN]
  apis: [API-AUTH-LOGIN]
  tests: [TC-AUTH-LOGIN-001]
---

# Login Requirement

## Statement

A user with valid credentials can authenticate using the project-approved identifier and session strategy.

## Acceptance Criteria

- Given valid credentials, when login succeeds, then the user receives an authenticated project-approved session.
- Given invalid credentials, when login fails, then no authenticated session is created.
- Authentication errors must not reveal whether an account exists unless explicitly approved by security policy.
