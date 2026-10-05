---
code: SCR-AUTH-GOOGLE-LOGIN
type: screen
title: Google Login screen
status: approved
owner: Product & Engineering
created_at: 2026-10-05
updated_at: 2026-10-05
tags: []
related:
  modules: []
  features: [FEAT-AUTH-GOOGLE-LOGIN]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: [API-AUTH-GOOGLE-LOGIN]
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

# Google Login screen

## Route
`{{AUTH_ROUTE_PREFIX}}/google`

## UI states
Loading, success, validation error, server error, no-permission/session-expired where applicable. Mobile projects must also define offline and lifecycle behavior.

## Data source
Uses `API-AUTH-GOOGLE-LOGIN`.
