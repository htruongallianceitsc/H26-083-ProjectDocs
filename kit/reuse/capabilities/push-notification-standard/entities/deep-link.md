---
code: DL-NOTIFICATION-TARGET
type: deep-link
title: Notification Target Deep Link
status: draft
owner: Product & Engineering
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
last_reviewed_at: YYYY-MM-DD
tags: [reuse, mobile]
related:
  modules: []
  features: [FEAT-NOTIFICATION-PUSH]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-NOTIFICATION-PUSH-001]
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

# Notification Target Deep Link

## Canonical Route
Project-selected target route.
## URL Patterns
Configured application scheme/universal link.
## Parameter Schema / Version
Validated target reference.
## Authentication Guard
Protected targets wait for authenticated session.
## Permission Guard
Apply target permission policy.
## Cold / Warm / Background App Behaviour
Capture once, then resolve after router ready.
## Invalid Target
Reject invalid parameters.
## Unauthorized Target
Navigate to safe fallback.
## Deleted Target
Navigate to safe fallback with non-sensitive message.
## Fallback Destination
Notification inbox or home.
## Analytics
Record resolution outcome.
## Tests
Cold/warm launch, invalid, deleted and unauthorized target.
