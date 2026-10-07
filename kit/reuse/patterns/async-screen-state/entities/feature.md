---
code: FEAT-PATTERN-ASYNC-SCREEN-STATE
type: feature
title: Async Screen State Pattern
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
  tests: [TC-PATTERN-ASYNC-SCREEN-STATE-001]
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

# Async Screen State Pattern

## Pattern
Model explicit Loading, Empty, Data Ready and Error states; preserve stale data only by documented policy.
## Questions
Can retry be automatic? What happens on refresh failure with existing data?
## Verification
Initial load, empty, refresh, retry and stale-response cancellation.
