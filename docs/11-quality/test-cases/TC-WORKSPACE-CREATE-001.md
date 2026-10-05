---
code: TC-WORKSPACE-CREATE-001
type: test-case
title: Create workspace grants creator owner role
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [workspace, test]
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-CREATE]
  requirements: [REQ-WORKSPACE-001]
  business_rules: []
  screens: []
  flows: []
  apis: [API-WORKSPACE-CREATE, API-WORKSPACE-LIST]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify creating a workspace atomically grants the creator the owner role and the workspace appears in their list.

## Verifies
`REQ-WORKSPACE-001`, `API-WORKSPACE-CREATE`, `API-WORKSPACE-LIST`

## Preconditions
Authenticated user with no existing workspaces.

## Test Data
`{ "name": "Acme Team" }`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | POST `/api/workspaces` with test data | `201 Created`, workspace returned |
| 2 | GET `/api/workspaces` | Response includes the new workspace with `role: "owner"` |

## Postconditions
One `workspace_members` row exists for the creator with role `owner`.

## Priority
P0

## Automation Candidate
Yes — API integration test.

## Notes
None.
