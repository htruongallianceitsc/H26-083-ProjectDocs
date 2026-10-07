---
code: FEAT-AUTH-TOKEN-REFRESH
type: feature
title: Single-Flight Token Refresh
status: draft
owner: Product & Engineering
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
last_reviewed_at: YYYY-MM-DD
tags: [reuse, mobile]
related:
  modules: [MOD-AUTH]
  features: []
  requirements: [REQ-AUTH-TOKEN-REFRESH-001]
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-AUTH-TOKEN-REFRESH-001]
  decisions: []
  integrations: []
  nfrs: []
  runbooks: []
  permissions: []
  native_capabilities: []
  deep_links: []
  push_events: []
  local_storage: []
  sync_policies: []
  background_jobs_mobile: []
  analytics_events: []
  feature_flags: []
  device_test_profiles: []
  open_questions: []
  releases: []
---

# Single-Flight Token Refresh

## Goal
Coordinate concurrent authentication failures through one refresh operation.

## Main Flow
The first eligible 401 starts refresh; concurrent requests join it; success replays eligible requests once; failure invalidates the session.

## Edge Cases
Non-idempotent requests are replayed only when the API contract permits it.
