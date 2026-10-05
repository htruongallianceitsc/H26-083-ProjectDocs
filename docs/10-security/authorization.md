---
code: DOC-SEC-AUTHORIZATION
type: document
title: Authorization
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [security, authorization]
related:
  modules: [MOD-WORKSPACE, MOD-BOARD]
  features: []
  requirements: []
  business_rules: [BR-WORKSPACE-001, BR-BOARD-001, BR-MEMBER-001]
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

# Authorization

## Model
Role-based, scoped to Workspace: `owner` / `admin` / `member`, per `docs/01-product/roles-permissions.md`. Board access is derived entirely from Workspace membership in v1 — there is no separate per-board ACL (`BR-BOARD-001`).

## Enforcement Point
Every mutating API checks the caller's Workspace membership/role server-side before any write (never trust a client-side-only check). See each API contract's "Authentication / Authorization" section in `docs/07-api/`.

## Elevated-Permission Actions
Restricted to `owner`/`admin`: inviting/removing workspace members, changing roles (`BR-WORKSPACE-001`), managing board settings and labels (board creator or workspace owner/admin, `FEAT-BOARD-MANAGE`, `FEAT-LABEL-MANAGE`).

## Open-to-All-Members Actions
Creating boards/lists/cards, moving cards, assigning labels/members, commenting — any Workspace member (no owner/admin gate), reflecting the collaborative, low-friction nature of the product.

## Owner Protection
A Workspace's `owner` role cannot be removed or demoted by an `admin` (`BR-WORKSPACE-001`); ownership transfer is not yet supported (tracked as an open item).

## Out of Scope (v1)
No per-board private visibility enforcement beyond the `visibility` field existing on `DB-BOARD` (reserved for future use); no granular per-feature permission overrides beyond the three-role model.
