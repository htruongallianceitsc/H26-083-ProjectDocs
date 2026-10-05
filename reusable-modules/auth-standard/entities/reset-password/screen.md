---
code: SCR-AUTH-RESET-PASSWORD
type: screen
title: Reset Password screen
status: approved
owner: Product & Engineering
created_at: 2026-10-05
updated_at: 2026-10-05
tags: []
related:
  modules: []
  features: [FEAT-AUTH-RESET-PASSWORD]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: [API-AUTH-RESET-PASSWORD]
  database_objects: []
  tests: []
  decisions: []
  integrations: []
  nfrs: []
  runbooks: []
  permissions: []
  deep_links: []
  sync_policies: []
---

# Reset Password screen

## Route
`{{AUTH_ROUTE_PREFIX}}/reset-password`

## UI states
Loading, success, validation error, server error, no-permission/session-expired where applicable. Mobile projects must also define offline and lifecycle behavior.

## Data source
Uses `API-AUTH-RESET-PASSWORD`.
