---
code: PUSH-NOTIFICATION-GENERIC
type: push-event
title: Generic Push Event Contract
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
  deep_links: [DL-NOTIFICATION-TARGET]
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

# Generic Push Event Contract

## Event Name & Version
Generic notification; payloadVersion={{PUSH_PAYLOAD_VERSION}}.
## Producer
Backend notification service.
## Payload Schema
eventId, payloadVersion, notificationType, targetRef.
## Sensitive Data Policy
No secrets or unnecessary personal/business data.
## Foreground Behaviour
Apply project in-app presentation policy.
## Background Behaviour
OS notification; consume target only after user interaction.
## Terminated Behaviour
Capture initial intent and wait for bootstrap/router readiness.
## Navigation Contract
Use `DL-NOTIFICATION-TARGET` when enabled.
## No-navigation Behaviour
Open safe notification inbox/home fallback.
## Dedupe / Ordering
Dedupe by eventId.
## Analytics
Track received/opened/result without sensitive payload.
## Tests
Foreground/background/terminated, duplicate and invalid target.
