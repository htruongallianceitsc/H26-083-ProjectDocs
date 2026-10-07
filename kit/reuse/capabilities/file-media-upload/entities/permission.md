---
code: PERM-MEDIA-ACCESS
type: permission
title: Camera / Media Permission
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

# Camera / Media Permission

## Capability
Optional camera/media capture.
## Platforms
iOS / Android as applicable.
## Privacy Purpose
Allow the user to choose or capture an attachment they explicitly requested.
## Request Trigger
Immediately before the capability is used.
## Pre-prompt UX
Explain why access is needed.
## Granted Behaviour
Open approved capture/selection flow.
## Denied / Revoked Behaviour
Keep the feature usable with alternate source when available.
## Permanently Denied / Settings Flow
Offer settings action without repeated prompting.
## Limited / Partial Access
Respect partial photo access where supported.
## Return from Settings
Re-check permission once.
## Data Collected
Only the user-selected/captured item.
## Test Cases
Granted, denied, revoked and limited states.
