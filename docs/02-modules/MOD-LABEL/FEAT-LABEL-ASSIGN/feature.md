---
code: FEAT-LABEL-ASSIGN
type: feature
title: Assign Label to Card
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [label, card]
related:
  modules: [MOD-LABEL]
  features: []
  requirements: [REQ-LABEL-002]
  business_rules: []
  screens: [SCR-CARD-DETAIL]
  flows: []
  apis: [API-LABEL-ASSIGN, API-LABEL-REMOVE]
  database_objects: [DB-CARD-LABEL]
  tests: [TC-LABEL-ASSIGN-001]
  decisions: []
---

# Feature Specification

## 1. Overview
Any board member can toggle any of the board's labels on or off a given Card from the card detail view.

## 2. Business Goal
Make categorization a one-click action so labeling stays up to date without friction.

## 3. Actors
Any member of the Board's Workspace.

## 4. Preconditions
Card exists and is not archived; at least one label exists on the board (otherwise the picker shows "Create a label first", linking to `FEAT-LABEL-MANAGE`).

## 5. Trigger
User opens a Card and clicks the Labels control in `SCR-CARD-DETAIL`.

## 6. Main Flow
1. User opens the label picker on `SCR-CARD-DETAIL`, seeing the board's full label palette with a checkmark on labels already applied.
2. User clicks an unchecked label -> `API-LABEL-ASSIGN` is called, the label chip appears on the card immediately (optimistic UI) and on the card's tile on `SCR-BOARD`.
3. User clicks a checked label -> `API-LABEL-REMOVE` is called, the chip disappears.

## 7. Alternative Flows
None beyond toggling multiple labels in sequence.

## 8. Error / Exception Flows
- Label already assigned (race) -> idempotent success (no error) since `API-LABEL-ASSIGN` treats a duplicate assign as a no-op.
- Label or Card not found/deleted concurrently -> `404 NOT_FOUND`, UI removes the stale option from the picker.

## 9. Business Rules
None specific beyond standard board-membership authorization.

## 10. Screens / Routes
`SCR-CARD-DETAIL`

## 11. APIs
`API-LABEL-ASSIGN`, `API-LABEL-REMOVE`

## 12. Database Objects
`DB-CARD-LABEL`

## 13. Permissions
Any Workspace member (no owner/admin restriction — unlike managing the label palette itself).

## 14. Notifications / External Effects
A WebSocket `card.label_assigned`/`card.label_removed` event updates other viewers' boards in realtime.

## 15. Audit / Logging
Each assign/remove writes one `DB-ACTIVITY-LOG` row (`action_type = label_assigned` / `label_removed`).

## 16. Acceptance Summary
A board member can add or remove any board label from a card and sees the change reflected instantly on both the card detail view and the board tile, including for other connected viewers.

## 17. Edge Cases
A card can have any number of labels (up to the board's 20-label ceiling, which is already the practical limit).

## 18. Dependencies
At least one Label must exist on the Board (`FEAT-LABEL-MANAGE`).

## 19. Known Limitations
No bulk label assignment across multiple cards in v1.

## 20. Open Questions
None blocking.
