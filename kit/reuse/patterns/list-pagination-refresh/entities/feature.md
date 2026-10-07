---
code: FEAT-PATTERN-LIST-PAGINATION-REFRESH
type: feature
title: List Pagination Refresh Pattern
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
  tests: [TC-PATTERN-LIST-PAGINATION-REFRESH-001]
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

# List Pagination Refresh Pattern

## Pattern
Separate initial load, pull-to-refresh and next-page loading; dedupe items and ignore stale pages.
## Questions
Cursor or offset? Sort stability? End-of-list detection?
## Verification
Refresh during pagination, duplicate page, empty page and offline retry.
