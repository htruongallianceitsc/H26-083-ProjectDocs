---
code: FEAT-PATTERN-API-AUTH-REFRESH
type: feature
title: API Auth Refresh Pattern
status: draft
owner: Product & Engineering
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
last_reviewed_at: YYYY-MM-DD
tags: [reuse, mobile]
related:
  modules: []
  features: []
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-PATTERN-API-AUTH-REFRESH-001]
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

# API Auth Refresh Pattern

## Pattern
Coordinate concurrent 401 responses through one refresh promise and replay only eligible requests once.
## Questions
Which requests are idempotent? What invalidates the session?
## Verification
Concurrent 401, refresh success/failure, replay protection.
