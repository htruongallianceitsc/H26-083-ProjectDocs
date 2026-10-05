---
code: TC-LABEL-ASSIGN-001
type: test-case
title: Toggle a label on and off a card
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [label, card, test]
related:
  modules: [MOD-LABEL]
  features: [FEAT-LABEL-ASSIGN]
  requirements: [REQ-LABEL-002]
  business_rules: []
  screens: [SCR-CARD-DETAIL]
  flows: []
  apis: [API-LABEL-ASSIGN, API-LABEL-REMOVE]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify a board member can assign and then remove a label on a card.

## Verifies
`REQ-LABEL-002`, `API-LABEL-ASSIGN`, `API-LABEL-REMOVE`

## Preconditions
Card exists on a board with label "Bug"; test user is a board member (role `member`).

## Test Data
Card with no labels assigned.

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Call `POST /api/cards/{cardId}/labels/{labelId}` | `201 Created`; card detail shows the "Bug" label |
| 2 | Call `POST /api/cards/{cardId}/labels/{labelId}` again | `200 OK` (idempotent no-op) |
| 3 | Call `DELETE /api/cards/{cardId}/labels/{labelId}` | `204 No Content`; label no longer on card |

## Postconditions
Card has zero labels.

## Priority
P1

## Automation Candidate
Yes — API integration test.

## Notes
Verify a connected second WebSocket client receives `card.label_assigned`/`card.label_removed` events.
