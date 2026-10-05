---
code: TC-LABEL-MANAGE-001
type: test-case
title: Create label with duplicate name is rejected
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [label, test]
related:
  modules: [MOD-LABEL]
  features: [FEAT-LABEL-MANAGE]
  requirements: [REQ-LABEL-001]
  business_rules: [BR-LABEL-001]
  screens: []
  flows: []
  apis: [API-LABEL-CREATE]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify that creating a label whose name case-insensitively matches an existing label on the same board is rejected.

## Verifies
`BR-LABEL-001`, `REQ-LABEL-001`, `API-LABEL-CREATE`

## Preconditions
Board exists with an existing label named "Bug"; test user is the board's Workspace owner.

## Test Data
Board with label `{ name: "Bug", color: "red" }`.

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Call `POST /api/boards/{boardId}/labels` with `{ "name": "bug", "color": "green" }` | `409 LABEL_NAME_DUPLICATE` |
| 2 | Call the same endpoint with `{ "name": "Feature", "color": "green" }` | `201 Created`, new label returned |

## Postconditions
Board has exactly 2 labels: "Bug" and "Feature".

## Priority
P1

## Automation Candidate
Yes — API integration test.

## Notes
Also cover the 20-label ceiling (`LABEL_LIMIT_REACHED`) as a second case in the same automated suite.
