---
code: TC-CARD-EDIT-DETAIL-001
type: test-case
title: Due date before creation date is rejected
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card, test]
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-EDIT-DETAIL]
  requirements: [REQ-CARD-003]
  business_rules: [BR-CARD-002]
  screens: []
  flows: []
  apis: [API-CARD-UPDATE]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify card detail edits save correctly and the due-date validation rule is enforced.

## Verifies
`REQ-CARD-003`, `BR-CARD-002`, `API-CARD-UPDATE`

## Preconditions
Card `C` created on `2026-10-05`.

## Test Data
Valid: `{ "description": "Repro steps...", "dueDate": "2026-10-10" }`. Invalid: `{ "dueDate": "2026-10-01" }`.

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | PATCH `/api/cards/{C}` with valid data | `200 OK`, description and due date saved |
| 2 | PATCH `/api/cards/{C}` with invalid data | `400 VALIDATION_ERROR` |

## Postconditions
Card retains the valid due date from step 1 (step 2's change was rejected).

## Priority
P1

## Automation Candidate
Yes — API integration test.

## Notes
None.
