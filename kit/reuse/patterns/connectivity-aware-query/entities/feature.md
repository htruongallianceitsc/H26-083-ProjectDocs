---
code: FEAT-PATTERN-CONNECTIVITY-AWARE-QUERY
type: feature
title: Connectivity Aware Query Pattern
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
  tests: [TC-PATTERN-CONNECTIVITY-AWARE-QUERY-001]
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

# Connectivity Aware Query Pattern

## Pattern
Distinguish offline, transient failure and server failure; pause/retry remote work according to connectivity state.
## Questions
What can use stale cache? What must fail immediately offline?
## Verification
Offline start, online restoration and flapping connectivity.
