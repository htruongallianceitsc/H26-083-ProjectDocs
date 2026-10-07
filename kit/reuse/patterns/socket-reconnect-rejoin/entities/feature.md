---
code: FEAT-PATTERN-SOCKET-RECONNECT-REJOIN
type: feature
title: Socket Reconnect / Rejoin Pattern
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
  tests: [TC-PATTERN-SOCKET-RECONNECT-REJOIN-001]
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

# Socket Reconnect / Rejoin Pattern

## Pattern
Use one connection state machine with single reconnect attempt, backoff+jitter, rejoin ownership, dedupe and post-resume reconciliation.
## States
DISCONNECTED -> CONNECTING -> CONNECTED -> JOINING -> READY -> SUSPENDED/RECONNECTING.
## Verification
Offline/online, background/resume, server disconnect, duplicate event, multiple room rejoin.
