---
code: REQ-CARD-002
type: requirement
title: Move Card via Drag-and-Drop
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card, drag-and-drop]
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-MOVE]
  requirements: []
  business_rules: [BR-CARD-001]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-CARD-MOVE-001, TC-CARD-MOVE-002]
  decisions: [ADR-003, ADR-004]
---

# Requirement

## Statement
A Workspace member must be able to move a Card to a new position within its List or into a different List on the same Board via drag-and-drop, with the result synced in realtime to other viewers of that Board.

## Type
Functional

## Actor / Trigger
Workspace member; triggered by a drag-and-drop gesture on the board.

## Expected Behaviour
The move is optimistic on the client and confirmed/corrected by the server; concurrent conflicting moves are detected, not silently overwritten.

## Rationale / Source
The explicitly requested signature "kéo-thả" (drag-and-drop) interaction of the product.

## Priority
P0

## Acceptance Criteria
- Given a card and a target list on the same board, when a member drags the card there, then the card's `listId` and `position` update and the change is visible to another connected viewer without a manual refresh.
- Given two near-simultaneous conflicting move requests for the same card, when the second one arrives, then it is rejected with a conflict error rather than silently corrupting the first result.

## Dependencies
`FEAT-CARD-CREATE`, `FEAT-LIST-MANAGE`

## Related Business Rules
`BR-CARD-001`

## Verification
`TC-CARD-MOVE-001`, `TC-CARD-MOVE-002`
