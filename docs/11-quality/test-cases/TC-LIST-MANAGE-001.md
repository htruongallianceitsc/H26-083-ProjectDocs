---
code: TC-LIST-MANAGE-001
type: test-case
title: Cannot create a card in an archived list
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [list, test]
related:
  modules: [MOD-LIST]
  features: [FEAT-LIST-MANAGE]
  requirements: [REQ-LIST-001]
  business_rules: [BR-LIST-001]
  screens: []
  flows: []
  apis: [API-LIST-UPDATE, API-CARD-CREATE]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify archiving a list and then attempting to create a card in it is rejected.

## Verifies
`REQ-LIST-001`, `BR-LIST-001`, `API-LIST-UPDATE`, `API-CARD-CREATE`

## Preconditions
Active board with list `L`.

## Test Data
`{ "archivedAt": "2026-10-05T09:00:00Z" }`, `{ "title": "New card" }`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | PATCH `/api/lists/{L}` with archive body | `200 OK`, list archived |
| 2 | POST `/api/lists/{L}/cards` with card body | `409 LIST_ARCHIVED` |

## Postconditions
No card created.

## Priority
P1

## Automation Candidate
Yes — API integration test.

## Notes
None.
