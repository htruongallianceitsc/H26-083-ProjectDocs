---
code: TC-MEMBER-ASSIGN-CARD-001
type: test-case
title: Cannot assign a non-workspace-member to a card
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [member, card, test]
related:
  modules: [MOD-MEMBER]
  features: [FEAT-MEMBER-ASSIGN-CARD]
  requirements: [REQ-MEMBER-001]
  business_rules: [BR-MEMBER-001]
  screens: []
  flows: []
  apis: [API-CARD-MEMBER-ASSIGN, API-CARD-MEMBER-REMOVE]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify assignment is restricted to workspace members, and that assign/remove round-trips correctly for a valid member.

## Verifies
`REQ-MEMBER-001`, `BR-MEMBER-001`, `API-CARD-MEMBER-ASSIGN`, `API-CARD-MEMBER-REMOVE`

## Preconditions
Card `C` on a board in workspace `W`; user `M` is a member of `W`; user `X` is not.

## Test Data
None beyond the above.

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | POST `/api/cards/{C}/members/{X}` | `403 USER_NOT_WORKSPACE_MEMBER` |
| 2 | POST `/api/cards/{C}/members/{M}` | `201 Created` |
| 3 | DELETE `/api/cards/{C}/members/{M}` | `204 No Content` |

## Postconditions
Card `C` has no assigned members.

## Priority
P2

## Automation Candidate
Yes — API integration test.

## Notes
None.
