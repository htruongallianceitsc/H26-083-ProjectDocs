---
code: TC-CARD-MOVE-001
type: test-case
title: Drag card to another list syncs to a second connected client
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card, drag-and-drop, realtime, test]
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-MOVE]
  requirements: [REQ-CARD-002]
  business_rules: [BR-CARD-001]
  screens: []
  flows: [FLOW-CARD-MOVE-DRAGDROP]
  apis: [API-CARD-MOVE]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify the happy-path card move: list/position update correctly, and a second client connected to the same board's WebSocket channel receives the change in realtime.

## Verifies
`REQ-CARD-002`, `BR-CARD-001`, `API-CARD-MOVE`, `FLOW-CARD-MOVE-DRAGDROP`

## Preconditions
Board with lists "To Do" (card `C` at position 1) and "In Progress" (empty). Two clients (browser sessions) viewing the same board; client 2 subscribed to the board's WebSocket channel.

## Test Data
`{ "targetListId": "<In Progress id>", "beforeCardId": null, "afterCardId": null, "updatedAt": "<C's current updatedAt>" }`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Client 1: PATCH `/api/cards/{C}/move` with test data | `200 OK`; `C.listId` = In Progress, new position assigned |
| 2 | Observe client 2's WebSocket stream | A `card.moved` event for card `C` arrives within ~1s |
| 3 | GET `/api/boards/{boardId}` | `C` appears under "In Progress", not "To Do" |

## Postconditions
Card `C` is in "In Progress"; one `activity_log` row with `action_type = card_moved` exists.

## Priority
P0

## Automation Candidate
Yes — API + WebSocket integration test.

## Notes
This is the single highest-priority regression test in the project given the product's emphasis on drag-and-drop.
