---
code: BR-WORKSPACE-001
type: business-rule
title: Workspace Role Permission Matrix
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [workspace, permissions]
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-MANAGE-MEMBERS]
  requirements: [REQ-WORKSPACE-002]
  business_rules: []
  screens: [SCR-WORKSPACE-SETTINGS]
  flows: []
  apis: [API-WORKSPACE-INVITE-MEMBER, API-WORKSPACE-UPDATE-MEMBER-ROLE, API-WORKSPACE-REMOVE-MEMBER]
  database_objects: [DB-WORKSPACE-MEMBER]
  tests: [TC-WORKSPACE-MANAGE-MEMBERS-001]
  decisions: []
---

# Business Rule

## Rule Statement
Only `owner` or `admin` members may invite/remove members or change roles within a Workspace, per `docs/01-product/roles-permissions.md`. A Workspace always has exactly one `owner`; that role cannot be removed or reassigned via the role-update/remove endpoints (ownership transfer is a separate, not-yet-built capability).

## Conditions
Applies to `API-WORKSPACE-INVITE-MEMBER`, `API-WORKSPACE-UPDATE-MEMBER-ROLE`, `API-WORKSPACE-REMOVE-MEMBER`.

## Result / Constraint
- A `member`-role caller gets `403 FORBIDDEN` on all three endpoints.
- Any caller (including another owner-level context, which cannot exist since there's only one owner) attempting to set `role=owner` via update, or to remove/demote the current owner, gets `403 FORBIDDEN`.

## Exceptions
None.

## Scope / Effective Context
Per-workspace.

## Positive Examples
An `admin` invites a new member and later promotes them to `admin`.

## Negative Examples
An `admin` tries to remove the `owner` -> rejected. A `member` tries to invite someone -> rejected.

## Error / Message
`FORBIDDEN` — "You don't have permission to manage members of this workspace." / "The workspace owner cannot be removed or demoted."

## Affected Features / Requirements / APIs / Screens
`FEAT-WORKSPACE-MANAGE-MEMBERS`, `REQ-WORKSPACE-002`, `API-WORKSPACE-INVITE-MEMBER`, `API-WORKSPACE-UPDATE-MEMBER-ROLE`, `API-WORKSPACE-REMOVE-MEMBER`, `SCR-WORKSPACE-SETTINGS`

## Test Coverage
`TC-WORKSPACE-MANAGE-MEMBERS-001`
