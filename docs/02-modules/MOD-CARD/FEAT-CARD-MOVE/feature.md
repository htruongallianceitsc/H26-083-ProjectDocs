---
code: FEAT-CARD-MOVE
type: feature
title: Move Card (drag-and-drop)
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card, drag-and-drop, realtime]
related:
  modules: [MOD-CARD]
  features: []
  requirements: [REQ-CARD-002]
  business_rules: [BR-CARD-001, BR-LIST-001, BR-LIST-002, BR-BOARD-002]
  screens: [SCR-BOARD]
  flows: [FLOW-CARD-MOVE-DRAGDROP]
  apis: [API-CARD-MOVE]
  database_objects: [DB-CARD]
  tests: [TC-CARD-MOVE-001, TC-CARD-MOVE-002]
  decisions: [ADR-003, ADR-004]
---

# Feature Specification

## 1. Overview
The single most important interaction in KanbanFlow: a user drags a Card tile and drops it at a new position, either within the same List or into a different List on the same Board. This is the primary way work status changes.

## 2. Business Goal
Make updating a card's status feel instantaneous and trustworthy, even with multiple people viewing the same board simultaneously.

## 3. Actors
Any member of the Board's Workspace.

## 4. Preconditions
Card, source List, and target List all belong to the same, non-archived Board; target List is not archived (`BR-LIST-001`, `BR-BOARD-002`).

## 5. Trigger
User presses and drags a card tile on `SCR-BOARD`.

## 6. Main Flow (see `FLOW-CARD-MOVE-DRAGDROP` for the full sequence diagram)
1. User picks up a card tile and drags it; the UI shows a live placeholder at the candidate drop position as the user moves the pointer across lists.
2. User releases the card over a target position. The client immediately re-renders the card in its new list/position (optimistic UI) — the user never waits on the network to see the move "happen".
3. Client calls `API-CARD-MOVE` with the target list, a position anchor (neighboring card ids), and the card's current `updatedAt` for an optimistic-concurrency check.
4. Server recomputes the fractional `position` (`BR-LIST-002`, same mechanism as List reorder), updates `list_id`/`board_id`/`position` on the Card, inserts one `activity_log` row (`action_type = card_moved`), and commits — all in one transaction.
5. Server broadcasts a `card.moved` event over the Board's WebSocket channel (`ADR-004`); every other client currently viewing this board moves the same card tile in their own view without a manual refresh.

## 7. Alternative Flows
Reordering within the same list (no list change) uses the same endpoint and flow, just with `targetListId` equal to the current list.

## 8. Error / Exception Flows
- **Conflict**: another move/edit happened to the same card between the client's last known state and this request (`updatedAt` mismatch) -> `409 CARD_MOVE_CONFLICT` (`BR-CARD-001`). The client discards its optimistic placement, re-fetches the card's current state, and re-renders it there, with a brief toast ("This card was moved by someone else").
- Target list archived -> `409 LIST_ARCHIVED`.
- Board archived -> `409 BOARD_ARCHIVED`.
- Card archived -> `409 CARD_ARCHIVED` (`BR-CARD-003`) — an archived card cannot be the subject of a move.

## 9. Business Rules
`BR-CARD-001`, `BR-LIST-001`, `BR-LIST-002`, `BR-BOARD-002`

## 10. Screens / Routes
`SCR-BOARD`

## 11. APIs
`API-CARD-MOVE`

## 12. Database Objects
`DB-CARD`

## 13. Permissions
Any Workspace member.

## 14. Notifications / External Effects
WebSocket `card.moved` broadcast to every client subscribed to the board's channel (`ARCH-004`).

## 15. Audit / Logging
One `DB-ACTIVITY-LOG` row per move (`action_type = card_moved`, `metadata` includes `fromListId`/`toListId`), visible in the card's activity feed (`FEAT-ACTIVITY-LOG`).

## 16. Acceptance Summary
A board member can drag any non-archived card to any position in any non-archived list on the same board; the change is visually instantaneous for them and propagates to other connected viewers without a page refresh; conflicting concurrent moves are detected and resolved without data corruption.

## 17. Edge Cases
- Two users drag the same card to different lists at nearly the same time: the first request to commit wins; the second gets `CARD_MOVE_CONFLICT` and is reconciled to the winning state.
- Dragging a card to the same position it already occupies is a no-op (client does not even call the API in that case).

## 18. Dependencies
`FEAT-CARD-CREATE`, `FEAT-LIST-MANAGE`, `ARCH-004` (realtime channel).

## 19. Known Limitations
Cross-board card move is out of scope for v1 (`BR-CARD-001`) — a card can only move between lists on the same board. No "undo last move" shortcut.

## 20. Open Questions
`OQ-002` (deeper conflict-resolution UX beyond the basic reconcile-and-toast approach, for future refinement if concurrent editing becomes frequent at scale).
