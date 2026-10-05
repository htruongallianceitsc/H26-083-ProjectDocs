---
code: TC-LIST-REORDER-001
type: test-case
title: Reorder a list between two siblings
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [list, drag-and-drop, test]
related:
  modules: [MOD-LIST]
  features: [FEAT-LIST-REORDER]
  requirements: [REQ-LIST-002]
  business_rules: [BR-LIST-002]
  screens: []
  flows: []
  apis: [API-LIST-REORDER]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify moving a list between two other lists computes the midpoint position and only updates one row.

## Verifies
`REQ-LIST-002`, `BR-LIST-002`, `API-LIST-REORDER`

## Preconditions
Board with 3 lists A (position 1), B (position 2), C (position 3).

## Test Data
`{ "beforeListId": "A", "afterListId": "B" }` applied to list C.

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | PATCH `/api/lists/{C}/position` with test data | `200 OK`; C's position is `1.5` |
| 2 | GET board detail | Lists ordered A, C, B |

## Postconditions
Only list C's row was updated; A and B positions unchanged.

## Priority
P1

## Automation Candidate
Yes — API integration test.

## Notes
Add a second scenario that forces the rebalance path (repeated fine-grained inserts) as a follow-up automated case.
