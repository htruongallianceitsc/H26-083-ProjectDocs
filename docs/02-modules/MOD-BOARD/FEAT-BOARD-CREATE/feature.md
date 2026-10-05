---
code: FEAT-BOARD-CREATE
type: feature
title: Create Board
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [board]
related:
  modules: [MOD-BOARD]
  features: []
  requirements: [REQ-BOARD-001]
  business_rules: [BR-BOARD-001]
  screens: [SCR-WORKSPACE-HOME, SCR-BOARD]
  flows: []
  apis: [API-BOARD-CREATE]
  database_objects: [DB-BOARD, DB-LIST]
  tests: [TC-BOARD-CREATE-001]
  decisions: []
---

# Feature Specification

## 1. Overview
A Workspace member creates a new Board, which is immediately seeded with 3 default Lists.

## 2. Business Goal
Get a new team/project workflow usable in a single action, without an empty-board cold start.

## 3. Actors
Any member of the owning Workspace.

## 4. Preconditions
Workspace exists and the user belongs to it.

## 5. Trigger
User clicks "Create board" on `SCR-WORKSPACE-HOME`.

## 6. Main Flow
1. User enters a board title (optionally a background) in the create-board dialog.
2. Client calls `API-BOARD-CREATE`.
3. Server creates the `DB-BOARD` row and 3 default `DB-LIST` rows ("To Do", "In Progress", "Done") in one transaction.
4. Client navigates to `SCR-BOARD` for the new board.

## 7. Alternative Flows
None.

## 8. Error / Exception Flows
Invalid title (empty or >100 chars) -> `400 VALIDATION_ERROR`. Caller not a workspace member -> `403 FORBIDDEN` (`BR-BOARD-001`).

## 9. Business Rules
`BR-BOARD-001`

## 10. Screens / Routes
`SCR-WORKSPACE-HOME` (trigger), `SCR-BOARD` (destination)

## 11. APIs
`API-BOARD-CREATE`

## 12. Database Objects
`DB-BOARD`, `DB-LIST`

## 13. Permissions
Any Workspace member (no owner/admin restriction on creating boards).

## 14. Notifications / External Effects
None.

## 15. Audit / Logging
Standard request logging.

## 16. Acceptance Summary
Any workspace member can create a board, which starts with a ready-to-use 3-list workflow.

## 17. Edge Cases
None notable.

## 18. Dependencies
`FEAT-WORKSPACE-CREATE`

## 19. Known Limitations
Default list names are fixed in v1 (not customizable at creation time); they can be renamed afterward via `FEAT-LIST-MANAGE`.

## 20. Open Questions
None blocking.
