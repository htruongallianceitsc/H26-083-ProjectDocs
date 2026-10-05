---
code: TC-WORKSPACE-MANAGE-MEMBERS-001
type: test-case
title: Admin cannot remove or demote the workspace owner
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [workspace, test]
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-MANAGE-MEMBERS]
  requirements: [REQ-WORKSPACE-002]
  business_rules: [BR-WORKSPACE-001, BR-WORKSPACE-002]
  screens: []
  flows: []
  apis: [API-WORKSPACE-INVITE-MEMBER, API-WORKSPACE-UPDATE-MEMBER-ROLE, API-WORKSPACE-REMOVE-MEMBER]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify role-based permission enforcement and the owner-protection rule.

## Verifies
`REQ-WORKSPACE-002`, `BR-WORKSPACE-001`, `BR-WORKSPACE-002`

## Preconditions
Workspace with owner `O`, admin `A` (both registered users), and a registered-but-not-yet-member user `C`.

## Test Data
`{ "email": "<C's email>" }`, `{ "role": "owner" }`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | As `A`, POST invite `C` | `201 Created`, `C` becomes `member` |
| 2 | As `A`, POST invite `C` again | `409 ALREADY_MEMBER` |
| 3 | As `A`, DELETE `O` from the workspace | `403 FORBIDDEN` |
| 4 | As `A`, PATCH `O`'s role to `member` | `403 FORBIDDEN` |
| 5 | As `C` (role `member`), POST invite another user | `403 FORBIDDEN` |

## Postconditions
`O` remains `owner`; `C` remains `member`.

## Priority
P0

## Automation Candidate
Yes — API integration test.

## Notes
None.
