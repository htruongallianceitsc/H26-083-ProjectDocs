---
code: BR-WORKSPACE-002
type: business-rule
title: Single Membership per Workspace
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [workspace]
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-MANAGE-MEMBERS]
  requirements: [REQ-WORKSPACE-002]
  business_rules: []
  screens: [SCR-WORKSPACE-SETTINGS]
  flows: [FLOW-WORKSPACE-INVITE-MEMBER]
  apis: [API-WORKSPACE-INVITE-MEMBER]
  database_objects: [DB-WORKSPACE-MEMBER]
  tests: [TC-WORKSPACE-MANAGE-MEMBERS-001]
  decisions: []
---

# Business Rule

## Rule Statement
A user may hold at most one membership row (one role) per Workspace. Inviting an email that already corresponds to a current member is rejected rather than creating a duplicate or silently changing their role.

## Conditions
Enforced at the database level via `UNIQUE (workspace_id, user_id)` on `DB-WORKSPACE-MEMBER`, checked by `API-WORKSPACE-INVITE-MEMBER` before insert.

## Result / Constraint
Duplicate invite attempt returns `409 ALREADY_MEMBER`; to change an existing member's role, the caller must use `API-WORKSPACE-UPDATE-MEMBER-ROLE` instead.

## Exceptions
None.

## Scope / Effective Context
Per-workspace.

## Positive Examples
Inviting a brand-new email succeeds.

## Negative Examples
Inviting an email that is already a `member` of the workspace fails with `ALREADY_MEMBER`.

## Error / Message
`ALREADY_MEMBER` — "This person is already a member of the workspace."

## Affected Features / Requirements / APIs / Screens
`FEAT-WORKSPACE-MANAGE-MEMBERS`, `REQ-WORKSPACE-002`, `API-WORKSPACE-INVITE-MEMBER`, `SCR-WORKSPACE-SETTINGS`

## Test Coverage
`TC-WORKSPACE-MANAGE-MEMBERS-001`
