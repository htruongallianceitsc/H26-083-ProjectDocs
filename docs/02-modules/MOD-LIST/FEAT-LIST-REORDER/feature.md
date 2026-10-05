---
code: FEAT-LIST-REORDER
type: feature
title: Reorder Lists (drag-and-drop)
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [list, drag-and-drop]
related:
  modules: [MOD-LIST]
  features: []
  requirements: [REQ-LIST-002]
  business_rules: [BR-LIST-002]
  screens: [SCR-BOARD]
  flows: []
  apis: [API-LIST-REORDER]
  database_objects: [DB-LIST]
  tests: [TC-LIST-REORDER-001]
  decisions: [ADR-003]
---

# Feature Specification

## 1. Overview
A board member drags a List horizontally to change its left-to-right order on the board.

## 2. Business Goal
Let the board's column order match the team's actual workflow sequence, adjustable at any time.

## 3. Actors
Any member of the Board's Workspace.

## 4. Preconditions
Board has 2 or more non-archived Lists; board is not archived.

## 5. Trigger
User drags a list header and drops it in a new position.

## 6. Main Flow
1. User picks up a list by its header and drags it between two other lists (or to an end position).
2. Client optimistically reorders the lists in the UI immediately.
3. Client calls `API-LIST-REORDER` with the target neighbor context; server computes the new fractional `position` (`ADR-003`, `BR-LIST-002`) and persists it.
4. Server broadcasts `list.reordered` over the board's WebSocket channel so other viewers see the same order.

## 7. Alternative Flows
None (no keyboard-only reorder path documented yet — tracked as a known limitation).

## 8. Error / Exception Flows
Server rejects the move (e.g. board archived) -> client reverts the optimistic reorder and shows a toast.

## 9. Business Rules
`BR-LIST-002`

## 10. Screens / Routes
`SCR-BOARD`

## 11. APIs
`API-LIST-REORDER`

## 12. Database Objects
`DB-LIST`

## 13. Permissions
Any Workspace member.

## 14. Notifications / External Effects
WebSocket `list.reordered` broadcast.

## 15. Audit / Logging
Standard request logging; not part of the card-level `activity_log`.

## 16. Acceptance Summary
A board member can drag a list to a new position and the order persists and syncs to other connected viewers.

## 17. Edge Cases
Rapid repeated reorders of the same list are each independent requests; the server always computes position from the latest state at request time.

## 18. Dependencies
`FEAT-LIST-MANAGE` (at least 2 lists must exist to reorder).

## 19. Known Limitations
No dedicated keyboard-only reorder control in v1 (see `SCR-BOARD` accessibility note about the card-level fallback — list reorder does not yet have an equivalent).

## 20. Open Questions
None blocking.
