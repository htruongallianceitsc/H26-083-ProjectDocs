---
code: SCR-WORKSPACE-HOME
type: screen
title: Workspace Home
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [workspace, screen]
route: /w/:workspaceId
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-CREATE, FEAT-BOARD-CREATE]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: [API-WORKSPACE-LIST, API-BOARD-CREATE]
  database_objects: []
  tests: []
  decisions: []
---

# Screen / Route

## Purpose
Show all Boards in the current Workspace and let the user create a new one.

## Route
`/w/:workspaceId`

## Accessible Roles
Any member of the Workspace.

## Entry Points
Post-login default route, workspace switcher, post-registration onboarding redirect.

## Layout / Sections
Workspace switcher (top), board grid (one card per board, showing title/background/starred state), "Create board" tile, settings link to `SCR-WORKSPACE-SETTINGS`.

## Fields

| Field | Type | Required | Validation | Notes |
|---|---|---:|---|---|
| boardTitle (in create-board dialog) | text | Yes | 1-100 chars | |

## Actions
Open a board, create a board, switch workspace, open workspace settings.

## Data Sources
`API-WORKSPACE-LIST` (switcher), `API-BOARD-GET-DETAIL`-adjacent board list is actually returned as part of workspace detail/board listing — board grid is populated via the boards owned by this workspace (see `API-BOARD-CREATE` for creation; listing uses the same workspace-scoped board collection).

## UI States
- Initial
- Loading
- Success
- Empty (no boards yet — shows a prominent "Create your first board" call to action)
- Error
- No Permission (user is not a member of `:workspaceId` -> redirect to workspace picker)

## Navigation Rules
Clicking a board navigates to `SCR-BOARD`.

## Validation & Messages
Board title required, 1-100 chars, mirrors `DB-BOARD` constraint.

## Responsive / Accessibility
Grid collapses to a single column at tablet width.

## Related Features / Rules / APIs
`FEAT-WORKSPACE-CREATE`, `FEAT-BOARD-CREATE`, `API-WORKSPACE-LIST`, `API-BOARD-CREATE`
