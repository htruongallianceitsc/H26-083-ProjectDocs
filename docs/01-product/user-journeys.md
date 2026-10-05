---
code: DOC-USER-JOURNEYS
type: document
title: User Journeys
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [journey]
related:
  modules: []
  features: [FEAT-AUTH-REGISTER, FEAT-WORKSPACE-CREATE, FEAT-BOARD-CREATE, FEAT-LIST-MANAGE, FEAT-CARD-CREATE, FEAT-CARD-MOVE]
  requirements: []
  business_rules: []
  screens: []
  flows: [FLOW-CARD-LIFECYCLE]
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

# User Journeys

## Journey 1 — First-time onboarding
1. User registers an account (`FEAT-AUTH-REGISTER`).
2. User creates their first Workspace (`FEAT-WORKSPACE-CREATE`).
3. User creates a Board inside the Workspace (`FEAT-BOARD-CREATE`), which is seeded with default Lists ("To Do", "In Progress", "Done").
4. User creates their first Card (`FEAT-CARD-CREATE`) and drags it across Lists as work progresses (`FEAT-CARD-MOVE`).

## Journey 2 — Daily usage
1. User opens a Board they are a member of.
2. User scans Cards assigned to them (via member avatar), opens a Card to read/add a comment (`FEAT-COMMENT-ADD`).
3. User drags the Card to the next List as status changes (`FEAT-CARD-MOVE`).
4. User marks the Card done by moving it to the "Done" list, then archives it later during board cleanup (`FEAT-CARD-ARCHIVE`).

## Journey 3 — Team setup
1. Workspace admin invites teammates by email (`FEAT-WORKSPACE-MANAGE-MEMBERS`).
2. Board owner creates Lists matching the team's workflow (`FEAT-LIST-MANAGE`) and defines Labels (`FEAT-LABEL-MANAGE`).
3. Teammates are assigned to Cards (`FEAT-MEMBER-ASSIGN-CARD`) as work is planned.
