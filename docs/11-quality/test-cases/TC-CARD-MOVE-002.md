---
code: TC-CARD-MOVE-002
type: test-case
title: Concurrent moves on the same card produce a conflict
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card, drag-and-drop, concurrency, test]
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
Verify that two near-simultaneous move requests for the same card, both built from the same stale `updatedAt`, result in exactly one success and one conflict — never a corrupted/duplicated state.

## Verifies
`REQ-CARD-002`, `BR-CARD-001`, `API-CARD-MOVE`

## Preconditions
Card `C` at known `updatedAt = T0`, in list "To Do".

## Test Data
Request A: `{ "targetListId": "In Progress", "updatedAt": "T0" }`. Request B: `{ "targetListId": "Done", "updatedAt": "T0" }`.

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Fire request A and request B concurrently | Exactly one returns `200 OK`; the other returns `409 CARD_MOVE_CONFLICT` with the card's current state in the body |
| 2 | GET `/api/cards/{C}` | Card's `listId` matches whichever request won; `updatedAt` is newer than `T0` |

## Postconditions
Card is in exactly one list (whichever request committed first); no duplicate `activity_log` rows for the losing request.

## Priority
P0

## Automation Candidate
Yes — requires firing two requests with a shared precondition and asserting on the response pair, not just the final state.

## Notes
This test protects the core guarantee behind `BR-CARD-001`'s optimistic-concurrency check.
