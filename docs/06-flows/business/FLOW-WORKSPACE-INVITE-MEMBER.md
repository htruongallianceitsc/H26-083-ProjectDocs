---
code: FLOW-WORKSPACE-INVITE-MEMBER
type: flow
title: Workspace Invite Member
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [workspace, flow, business]
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-MANAGE-MEMBERS]
  requirements: []
  business_rules: [BR-WORKSPACE-001, BR-WORKSPACE-002]
  screens: [SCR-WORKSPACE-SETTINGS]
  flows: []
  apis: [API-WORKSPACE-INVITE-MEMBER]
  database_objects: [DB-WORKSPACE-MEMBER]
  tests: [TC-WORKSPACE-MANAGE-MEMBERS-001]
  decisions: []
---

# Flow

## Purpose
Show the business process of inviting a teammate into a Workspace, including the v1 constraint that the invitee must already hold an account.

## Actors / Systems
Workspace owner/admin, invited user, Node.js API, email provider (`INT-EMAIL`).

## Preconditions
Actor holds `owner`/`admin` role in the target Workspace.

## Flow Diagram

```mermaid
flowchart TD
  A[Owner/admin enters invitee email] --> B{Email matches a registered user?}
  B -->|No| C[Return INVITE_USER_NOT_FOUND]
  B -->|Yes| D{Already a member?}
  D -->|Yes| E[Return ALREADY_MEMBER]
  D -->|No| F[Insert workspace_members row, role=member]
  F --> G[Send invite email via INT-EMAIL]
  G --> H[Invitee sees the workspace on next login/list call]
```

## Step Details

| Step | Actor/System | Action | Rule/API/Screen | Result |
|---|---|---|---|---|
| 1 | Owner/admin | Submits invitee email | SCR-WORKSPACE-SETTINGS | Request sent |
| 2 | API | Resolves email to user | BR-WORKSPACE-002 | Found / not found branch |
| 3 | API | Checks existing membership | BR-WORKSPACE-002 | New / duplicate branch |
| 4 | API | Inserts membership | DB-WORKSPACE-MEMBER | Member added |
| 5 | API | Sends notification | INT-EMAIL | Invitee notified |

## Error / Retry Paths
`INVITE_USER_NOT_FOUND`: owner/admin must ask the invitee to register first, then retry the invite. `ALREADY_MEMBER`: no retry needed, informational only.

## End States
Invitee is a `member` of the Workspace and can see its Boards on their next workspace list fetch.
