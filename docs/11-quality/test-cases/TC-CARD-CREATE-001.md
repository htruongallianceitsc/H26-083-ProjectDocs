---
code: TC-CARD-CREATE-001
type: test-case
title: Create card appends at end of list
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card, test]
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-CREATE]
  requirements: [REQ-CARD-001]
  business_rules: [BR-LIST-001]
  screens: []
  flows: []
  apis: [API-CARD-CREATE]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify a new card is created at the end of its list, and that an archived list rejects card creation.

## Verifies
`REQ-CARD-001`, `BR-LIST-001`, `API-CARD-CREATE`

## Preconditions
List `L` with 2 existing cards (positions 1, 2); archived list `L2`.

## Test Data
`{ "title": "Fix login bug" }`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | POST `/api/lists/{L}/cards` with test data | `201 Created`; new card position > 2 |
| 2 | POST `/api/lists/{L2}/cards` with test data | `409 LIST_ARCHIVED` |

## Postconditions
List `L` has 3 cards; `L2` unchanged.

## Priority
P0

## Automation Candidate
Yes — API integration test.

## Notes
None.
