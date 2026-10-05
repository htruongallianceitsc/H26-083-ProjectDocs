---
code: DOC-ASSUMPTIONS
type: document
title: Assumptions and Constraints
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [assumptions, constraints]
related:
  modules: []
  features: []
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: []
  decisions: [ADR-001, ADR-002, ADR-003, ADR-004, ADR-005, ADR-006]
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

# Assumptions and Constraints

## Facts
- Target stack is React (frontend), Node.js (backend API + WebSocket), PostgreSQL (database) — see `project.profile.json`.
- A User must belong to at least one Workspace to create or view Boards.
- A Card always belongs to exactly one List at a time; moving a Card changes that ownership.

## Assumptions
- Workspace membership is invite-based (no public self-signup into an existing workspace) — see `FEAT-WORKSPACE-MANAGE-MEMBERS` and `BR-WORKSPACE-002`.
- Initial scale target is teams of up to ~200 members per workspace and a few thousand cards per board; no requirement yet for sharding or read replicas (see `NFR-SCALE-001`).
- One primary region/deployment is sufficient for the MVP; disaster recovery across regions is out of scope for v1.

## Constraints
- No native mobile app in this phase; the web app is responsive but optimized for desktop/tablet (`NFR-BROWSER-001`).
- No file attachment storage provider has been selected (`OQ-003`), so `FEAT-CARD-EDIT-DETAIL` does not include attachments in v1.
- No notification/email provider is finalized for anything beyond transactional auth/invite email (`OQ-005`), so in-app/email notifications on card activity are out of scope for v1.
- Soft-delete only (`ADR-005`): hard delete of Boards/Lists/Cards/Comments is not exposed to end users in v1.
