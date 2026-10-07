---
code: NCAP-FILE-PICKER
type: native-capability
title: File Picker Capability
status: draft
owner: Product & Engineering
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
last_reviewed_at: YYYY-MM-DD
tags: [reuse, mobile]
related:
  modules: []
  features: [FEAT-FILE-UPLOAD]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-FILE-UPLOAD-001]
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

# File Picker Capability

## Purpose
Select project-approved files/media.
## Platform APIs / Libraries
Project-approved Expo/native adapter.
## Abstraction Boundary
Feature calls a core media/file adapter.
## Availability Detection
Check platform/provider availability.
## Permission Dependency
Request only permissions required by the selected acquisition method.
## Failure / Fallback
Offer alternate source or actionable error where possible.
## Lifecycle Constraints
Handle app resume after external picker.
## Privacy / Security
Do not copy sensitive files beyond required app storage.
## Tests
Cancel, unavailable provider and resume.
