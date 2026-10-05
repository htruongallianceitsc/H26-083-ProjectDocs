---
code: TC-BOARD-CREATE-001
type: test-case
title: Create board seeds 3 default lists
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [board, test]
related:
  modules: [MOD-BOARD]
  features: [FEAT-BOARD-CREATE]
  requirements: [REQ-BOARD-001]
  business_rules: [BR-BOARD-001]
  screens: []
  flows: []
  apis: [API-BOARD-CREATE]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify board creation seeds exactly 3 default lists and enforces workspace-membership authorization.

## Verifies
`REQ-BOARD-001`, `BR-BOARD-001`, `API-BOARD-CREATE`

## Preconditions
Workspace `W` with member `U`; user `X` who is NOT a member of `W`.

## Test Data
`{ "title": "Sprint 24" }`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | As `U`, POST `/api/workspaces/{W}/boards` with test data | `201 Created`; response has exactly 3 lists titled "To Do", "In Progress", "Done" |
| 2 | As `X`, POST the same endpoint | `403 FORBIDDEN` |

## Postconditions
Exactly one board + 3 lists created (step 1 only).

## Priority
P0

## Automation Candidate
Yes — API integration test.

## Notes
None.
