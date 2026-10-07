---
code: REQ-AUTH-TOKEN-REFRESH-001
type: requirement
title: Single-Flight Refresh Requirement
status: draft
owner: Product & Engineering
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
last_reviewed_at: YYYY-MM-DD
tags: [reuse, mobile]
related:
  modules: []
  features: [FEAT-AUTH-TOKEN-REFRESH]
  requirements: []
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

# Single-Flight Refresh Requirement

## Requirement
At most one token refresh may be active for a session.

## Acceptance Criteria
- AC-1: concurrent 401 responses share one refresh.
- AC-2: refresh failure rejects queued requests and signs the session out.
