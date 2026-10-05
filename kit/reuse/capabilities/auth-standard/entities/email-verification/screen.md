---
code: SCR-AUTH-EMAIL-VERIFICATION
type: screen
title: Email Verification screen
status: approved
owner: Product & Engineering
created_at: 2026-10-05
updated_at: 2026-10-05
tags: []
related:
  modules: []
  features: [FEAT-AUTH-EMAIL-VERIFICATION]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: [API-AUTH-EMAIL-VERIFICATION]
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

# Email Verification screen

## Route
`{{AUTH_ROUTE_PREFIX}}/verify-email`

## UI states
Loading, success, validation error, server error, no-permission/session-expired where applicable. Mobile projects must also define offline and lifecycle behavior.

## Data source
Uses `API-AUTH-EMAIL-VERIFICATION`.
