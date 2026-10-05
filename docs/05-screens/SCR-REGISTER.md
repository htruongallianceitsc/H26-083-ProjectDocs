---
code: SCR-REGISTER
type: screen
title: Register
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth, screen]
route: /register
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-REGISTER]
  requirements: []
  business_rules: [BR-AUTH-001]
  screens: []
  flows: []
  apis: [API-AUTH-REGISTER]
  database_objects: []
  tests: [TC-AUTH-REGISTER-001]
  decisions: []
---

# Screen / Route

## Purpose
Let a new visitor create an account.

## Route
`/register`

## Accessible Roles
Anonymous.

## Entry Points
Direct navigation, link from `/login` ("Create an account").

## Layout / Sections
Display name field, email field, password field (with policy hint), submit button, "Already have an account?" link to `/login`.

## Fields

| Field | Type | Required | Validation | Notes |
|---|---|---:|---|---|
| displayName | text | Yes | 1-80 chars | |
| email | text | Yes | valid email format | |
| password | password | Yes | min 8 chars, 1 letter + 1 digit (`BR-AUTH-001`) | live strength hint shown |

## Actions
Submit registration, navigate to login.

## Data Sources
`API-AUTH-REGISTER`

## UI States
- Initial
- Loading
- Success (redirect to onboarding)
- Error (duplicate email / validation message inline)
- Empty — n/a
- No Permission — n/a

## Navigation Rules
On success, redirect to the first-time onboarding step (create first Workspace, `SCR-WORKSPACE-HOME` with an empty state).

## Validation & Messages
Client-side format/policy pre-check mirrors `BR-AUTH-001`; server is authoritative.

## Responsive / Accessibility
Single-column form, usable down to tablet width; password visibility toggle.

## Related Features / Rules / APIs
`FEAT-AUTH-REGISTER`, `BR-AUTH-001`, `API-AUTH-REGISTER`
