---
code: FEAT-LIST-MANAGE
type: feature
title: Manage Lists
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [list]
related:
  modules: [MOD-LIST]
  features: []
  requirements: [REQ-LIST-001]
  business_rules: [BR-LIST-001]
  screens: [SCR-BOARD]
  flows: []
  apis: [API-LIST-CREATE, API-LIST-UPDATE]
  database_objects: [DB-LIST]
  tests: [TC-LIST-MANAGE-001]
  decisions: []
---

# Feature Specification

## 1. Overview
Board members create new Lists, rename existing ones, and archive Lists they no longer need.

## 2. Business Goal
Let each team shape the board's workflow columns to match how they actually work (not a fixed To Do/Doing/Done template beyond the initial default).

## 3. Actors
Any member of the Board's Workspace.

## 4. Preconditions
Board exists and is not archived (`BR-BOARD-002`).

## 5. Trigger
User clicks "Add list" on `SCR-BOARD`, or the list menu's "Rename"/"Archive this list".

## 6. Main Flow
1. User clicks "Add list", types a title, confirms -> `API-LIST-CREATE` appends it at the end of the board.
2. User renames a list inline -> `API-LIST-UPDATE`.
3. User archives a list from its menu -> `API-LIST-UPDATE` with the archive flag; the list disappears from the board view.

## 7. Alternative Flows
None.

## 8. Error / Exception Flows
Empty/too-long title -> `400 VALIDATION_ERROR`. Board archived -> `409 BOARD_ARCHIVED` (`BR-BOARD-002`).

## 9. Business Rules
`BR-LIST-001`

## 10. Screens / Routes
`SCR-BOARD`

## 11. APIs
`API-LIST-CREATE`, `API-LIST-UPDATE`

## 12. Database Objects
`DB-LIST`

## 13. Permissions
Any Workspace member.

## 14. Notifications / External Effects
A WebSocket `list.created`/`list.updated` event syncs other viewers.

## 15. Audit / Logging
Standard request logging (list-level changes are not written to the card-scoped `activity_log`).

## 16. Acceptance Summary
A board member can add, rename, and archive lists on an active board.

## 17. Edge Cases
Archiving a list with existing cards in it archives the list, not its cards; those cards simply become inaccessible from the default board view until the list is restored (`BR-LIST-001`).

## 18. Dependencies
`FEAT-BOARD-CREATE`

## 19. Known Limitations
No "restore archived list" UI exposed in v1.

## 20. Open Questions
None blocking.
