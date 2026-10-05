---
code: TC-CARD-ARCHIVE-001
type: test-case
title: Archived card disappears from board and rejects further edits
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card, test]
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-ARCHIVE]
  requirements: [REQ-CARD-004]
  business_rules: [BR-CARD-003]
  screens: []
  flows: []
  apis: [API-CARD-ARCHIVE, API-CARD-UPDATE]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify archiving a card removes it from the board view and that it becomes read-only.

## Verifies
`REQ-CARD-004`, `BR-CARD-003`, `API-CARD-ARCHIVE`

## Preconditions
Active card `C` on board `B`.

## Test Data
`{ "title": "Should fail" }`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | POST `/api/cards/{C}/archive` | `200 OK`, `archivedAt` set |
| 2 | GET `/api/boards/{B}` | `C` is not present in any list's cards |
| 3 | PATCH `/api/cards/{C}` with test data | `409 CARD_ARCHIVED` |
| 4 | POST `/api/cards/{C}/archive` again | `409 ALREADY_ARCHIVED` |

## Postconditions
Card remains archived and unchanged.

## Priority
P1

## Automation Candidate
Yes — API integration test.

## Notes
None.
