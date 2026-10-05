---
code: FEAT-BOARD-MANAGE
type: feature
title: Manage Board Settings
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [board]
related:
  modules: [MOD-BOARD]
  features: []
  requirements: [REQ-BOARD-002]
  business_rules: [BR-BOARD-002]
  screens: [SCR-BOARD-SETTINGS]
  flows: []
  apis: [API-BOARD-GET-DETAIL, API-BOARD-UPDATE, API-BOARD-ARCHIVE]
  database_objects: [DB-BOARD]
  tests: [TC-BOARD-MANAGE-001]
  decisions: [ADR-005]
---

# Feature Specification

## 1. Overview
The board's creator (or any workspace owner/admin) updates its title/background/visibility, stars it for quick access, or archives it when the project is done.

## 2. Business Goal
Keep boards tidy and personalized without losing historical data (archive, not delete).

## 3. Actors
Board creator, or Workspace `owner`/`admin`.

## 4. Preconditions
Board exists.

## 5. Trigger
User opens `SCR-BOARD-SETTINGS` from the board view.

## 6. Main Flow
1. User loads `SCR-BOARD-SETTINGS`, fetched via `API-BOARD-GET-DETAIL`.
2. User edits title/background/visibility/star and saves -> `API-BOARD-UPDATE`.
3. User clicks "Archive board" -> `API-BOARD-ARCHIVE`; the board becomes read-only and disappears from the default `SCR-WORKSPACE-HOME` grid.

## 7. Alternative Flows
None.

## 8. Error / Exception Flows
Non-creator/non-owner/admin attempts to change settings -> `403 FORBIDDEN`. Attempting to modify an already-archived board's lists/cards (not settings) -> `409 BOARD_ARCHIVED` (`BR-BOARD-002`).

## 9. Business Rules
`BR-BOARD-002`

## 10. Screens / Routes
`SCR-BOARD-SETTINGS`

## 11. APIs
`API-BOARD-GET-DETAIL`, `API-BOARD-UPDATE`, `API-BOARD-ARCHIVE`

## 12. Database Objects
`DB-BOARD`

## 13. Permissions
Board creator, or Workspace `owner`/`admin`.

## 14. Notifications / External Effects
None.

## 15. Audit / Logging
Standard request logging.

## 16. Acceptance Summary
Authorized users can update board settings and archive a board; an archived board becomes read-only everywhere.

## 17. Edge Cases
Un-archiving is done via the same `API-BOARD-UPDATE`-family action (toggle `archivedAt` back to null) — exposed in v1 via `API-BOARD-UPDATE` accepting an explicit unarchive flag; see the API doc for the exact contract.

## 18. Dependencies
`FEAT-BOARD-CREATE`

## 19. Known Limitations
No board deletion (hard delete) in v1 — archive is the only lifecycle end-state.

## 20. Open Questions
None blocking.
