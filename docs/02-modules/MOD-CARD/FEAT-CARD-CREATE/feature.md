---
code: FEAT-CARD-CREATE
type: feature
title: Create Card
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card]
related:
  modules: [MOD-CARD]
  features: []
  requirements: [REQ-CARD-001]
  business_rules: [BR-LIST-001, BR-BOARD-002]
  screens: [SCR-BOARD]
  flows: [FLOW-CARD-LIFECYCLE]
  apis: [API-CARD-CREATE]
  database_objects: [DB-CARD]
  tests: [TC-CARD-CREATE-001]
  decisions: []
---

# Feature Specification

## 1. Overview
A board member adds a new Card to a List by typing a title.

## 2. Business Goal
Make capturing a new work item a one-step action with zero required fields beyond a title.

## 3. Actors
Any member of the Board's Workspace.

## 4. Preconditions
List exists, is not archived, and its Board is not archived.

## 5. Trigger
User clicks "Add card" at the bottom of a list on `SCR-BOARD`.

## 6. Main Flow
1. User types a title in the inline add-card input and presses Enter.
2. Client optimistically renders the new card tile immediately with a temporary id.
3. Client calls `API-CARD-CREATE`; on success, the temporary card is reconciled with the server-assigned id.
4. Other connected viewers receive the new card via a `card.created` WebSocket event.

## 7. Alternative Flows
User can keep the add-card input open to add several cards in a row (press Enter repeatedly).

## 8. Error / Exception Flows
Empty/too-long title -> `400 VALIDATION_ERROR`, optimistic tile is removed. List archived -> `409 LIST_ARCHIVED` (`BR-LIST-001`). Board archived -> `409 BOARD_ARCHIVED` (`BR-BOARD-002`).

## 9. Business Rules
`BR-LIST-001`, `BR-BOARD-002`

## 10. Screens / Routes
`SCR-BOARD`

## 11. APIs
`API-CARD-CREATE`

## 12. Database Objects
`DB-CARD`

## 13. Permissions
Any Workspace member.

## 14. Notifications / External Effects
WebSocket `card.created` broadcast.

## 15. Audit / Logging
One `DB-ACTIVITY-LOG` row (`action_type = card_created`).

## 16. Acceptance Summary
A board member can add a card to any active list with just a title, visible to themself instantly and to others via realtime sync shortly after.

## 17. Edge Cases
New card is always appended at the end of the target list (`position = max(existing) + 1`).

## 18. Dependencies
`FEAT-LIST-MANAGE`

## 19. Known Limitations
No quick-add fields beyond title (description/due date/labels are added afterward via `FEAT-CARD-EDIT-DETAIL`).

## 20. Open Questions
None blocking.
