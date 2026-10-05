---
code: TC-BOARD-MANAGE-001
type: test-case
title: Archived board rejects card creation
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [board, test]
related:
  modules: [MOD-BOARD]
  features: [FEAT-BOARD-MANAGE]
  requirements: [REQ-BOARD-002]
  business_rules: [BR-BOARD-002]
  screens: []
  flows: []
  apis: [API-BOARD-ARCHIVE, API-CARD-CREATE]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify archiving a board makes its lists/cards read-only, and that unarchiving restores write access.

## Verifies
`REQ-BOARD-002`, `BR-BOARD-002`, `API-BOARD-ARCHIVE`

## Preconditions
Board `B` with at least one list `L`, owned by user `U` (board creator).

## Test Data
None beyond existing board/list.

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | As `U`, POST `/api/boards/{B}/archive` | `200 OK`, `archivedAt` set |
| 2 | As `U`, POST `/api/lists/{L}/cards` with `{ "title": "New card" }` | `409 BOARD_ARCHIVED` |
| 3 | As `U`, PATCH `/api/boards/{B}` with `{ "archivedAt": null }` | `200 OK`, `archivedAt` null |
| 4 | Repeat step 2 | `201 Created` |

## Postconditions
Board is active again with one new card.

## Priority
P1

## Automation Candidate
Yes — API integration test.

## Notes
None.
