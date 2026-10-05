---
code: SCR-WORKSPACE-SETTINGS
type: screen
title: Workspace Settings
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [workspace, screen]
route: /w/:workspaceId/settings
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-MANAGE-MEMBERS]
  requirements: []
  business_rules: [BR-WORKSPACE-001]
  screens: []
  flows: []
  apis: [API-WORKSPACE-INVITE-MEMBER, API-WORKSPACE-UPDATE-MEMBER-ROLE, API-WORKSPACE-REMOVE-MEMBER]
  database_objects: []
  tests: [TC-WORKSPACE-MANAGE-MEMBERS-001]
  decisions: []
---

# Screen / Route

## Purpose
Let a Workspace owner/admin manage membership and roles.

## Route
`/w/:workspaceId/settings`

## Accessible Roles
Visible to any member (read-only for `member` role); invite/role/remove controls are only interactive for `owner`/`admin`.

## Entry Points
Settings link from `SCR-WORKSPACE-HOME`.

## Layout / Sections
Member list table (name, email, role, joined date, remove button), "Invite member" form (email input).

## Fields

| Field | Type | Required | Validation | Notes |
|---|---|---:|---|---|
| inviteEmail | text | Yes | valid email format | |
| role (per row) | select | Yes | one of owner/admin/member | owner row's selector is disabled |

## Actions
Invite member, change a member's role, remove a member.

## Data Sources
`API-WORKSPACE-INVITE-MEMBER`, `API-WORKSPACE-UPDATE-MEMBER-ROLE`, `API-WORKSPACE-REMOVE-MEMBER`

## UI States
- Initial
- Loading
- Success (inline confirmation toast per action)
- Empty — n/a (workspace always has at least the owner)
- Error (e.g. `INVITE_USER_NOT_FOUND`, `ALREADY_MEMBER` shown inline on the invite form)
- No Permission (a `member`-role viewer sees the list read-only with controls disabled)

## Navigation Rules
None beyond back-to-board-list.

## Validation & Messages
Invite email format checked client-side; all authorization errors (`FORBIDDEN`) shown as a toast and the action reverted.

## Responsive / Accessibility
Member table becomes a stacked card list at tablet width.

## Related Features / Rules / APIs
`FEAT-WORKSPACE-MANAGE-MEMBERS`, `BR-WORKSPACE-001`, `API-WORKSPACE-INVITE-MEMBER`, `API-WORKSPACE-UPDATE-MEMBER-ROLE`, `API-WORKSPACE-REMOVE-MEMBER`
