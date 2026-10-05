---
code: DOC-ROLES-PERMISSIONS
type: document
title: Roles and Permissions
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [roles, permissions]
related:
  modules: [MOD-WORKSPACE, MOD-BOARD]
  features: []
  requirements: []
  business_rules: [BR-WORKSPACE-001]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: []
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

# Roles and Permissions

Roles are assigned per Workspace (a User can hold a different role in each Workspace they belong to). Board-level access is derived from Workspace membership for v1 (no separate per-board ACL).

| Role | Can create Boards | Can manage Workspace members/roles | Can manage Board settings/labels | Can create/move/edit/archive Cards | Can delete Workspace |
|---|---|---|---|---|---|
| owner | Yes | Yes | Yes | Yes | Yes |
| admin | Yes | Yes (cannot remove/demote owner) | Yes | Yes | No |
| member | Yes | No | Only on boards they created, or if promoted | Yes | No |

See `BR-WORKSPACE-001` for the authoritative rule statement and enforcement points. Every Workspace has exactly one `owner` (the creator by default; ownership transfer is a future item, see `docs/19-open-items/open-questions.md`).
