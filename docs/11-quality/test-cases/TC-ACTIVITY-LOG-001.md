---
code: TC-ACTIVITY-LOG-001
type: test-case
title: Activity feed reflects create, move, and comment events in order
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [activity, test]
related:
  modules: [MOD-COMMENT]
  features: [FEAT-ACTIVITY-LOG]
  requirements: [REQ-COMMENT-002]
  business_rules: []
  screens: []
  flows: []
  apis: [API-ACTIVITY-LIST]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify the activity feed captures and orders multiple event types correctly.

## Verifies
`REQ-COMMENT-002`, `API-ACTIVITY-LIST`

## Preconditions
None (fresh card).

## Test Data
None.

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Create a card | `activity_log` has 1 row (`card_created`) |
| 2 | Move the card to another list | `activity_log` has 2 rows, newest is `card_moved` |
| 3 | Add a comment | `activity_log` has 3 rows, newest is `comment_added` |
| 4 | GET `/api/cards/{cardId}/activity` | Returns exactly these 3 entries, newest first: `comment_added`, `card_moved`, `card_created` |

## Postconditions
None (read-only verification).

## Priority
P2

## Automation Candidate
Yes — API integration test.

## Notes
None.
