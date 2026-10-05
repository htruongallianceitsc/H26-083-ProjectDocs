---
code: SCR-LOGIN
type: screen
title: Login
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth, screen]
route: /login
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-LOGIN]
  requirements: []
  business_rules: [BR-AUTH-002]
  screens: []
  flows: [FLOW-AUTH-LOGIN]
  apis: [API-AUTH-LOGIN]
  database_objects: []
  tests: [TC-AUTH-LOGIN-001]
  decisions: []
---

# Screen / Route

## Purpose
Let a registered user authenticate.

## Route
`/login`

## Accessible Roles
Anonymous (redirects authenticated users to their last workspace).

## Entry Points
Direct navigation, link from `/register` ("Already have an account?"), redirect after logout, redirect from any protected route when unauthenticated.

## Layout / Sections
Email field, password field, "Forgot password?" link, submit button, "Create an account" link to `/register`.

## Fields

| Field | Type | Required | Validation | Notes |
|---|---|---:|---|---|
| email | text | Yes | valid email format | |
| password | password | Yes | non-empty | |

## Actions
Submit login, navigate to forgot-password, navigate to register.

## Data Sources
`API-AUTH-LOGIN`

## UI States
- Initial
- Loading (submit in progress)
- Success (redirect away)
- Error (invalid credentials / account locked message shown inline)
- Empty — n/a
- No Permission — n/a

## Navigation Rules
On success, redirect to the user's most recently used Workspace, or the workspace picker if none/multiple and no last-used preference stored.

## Validation & Messages
Client-side format check on email before submit; server error messages shown verbatim (`INVALID_CREDENTIALS`, `ACCOUNT_LOCKED`).

## Responsive / Accessibility
Single-column form, usable down to tablet width; labeled inputs, visible focus states, submit reachable via Enter key.

## Related Features / Rules / APIs
`FEAT-AUTH-LOGIN`, `BR-AUTH-002`, `API-AUTH-LOGIN`
