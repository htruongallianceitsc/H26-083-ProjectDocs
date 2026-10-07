---
code: FEAT-NOTIFICATION-PUSH
type: feature
title: Push Notification
status: draft
owner: Product & Engineering
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
last_reviewed_at: YYYY-MM-DD
tags: [reuse, mobile]
related:
  modules: [MOD-NOTIFICATION]
  features: []
  requirements: [REQ-NOTIFICATION-PUSH-001]
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
  push_events: [PUSH-NOTIFICATION-GENERIC]
  local_storage: []
  sync_policies: []
  background_jobs_mobile: []
  analytics_events: []
  feature_flags: []
  device_test_profiles: []
  open_questions: []
  releases: []
---

# Push Notification

## Overview
Receive a versioned push payload and present or navigate consistently across app lifecycle states.
## Main Flow
Receive -> validate version -> classify foreground/background/terminated -> display/record -> resolve target -> auth/target guard -> navigate or fallback.
## Security / Privacy
Sensitive business data is not embedded directly in the notification payload.
