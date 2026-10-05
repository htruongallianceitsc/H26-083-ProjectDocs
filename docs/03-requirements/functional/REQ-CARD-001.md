---
code: REQ-CARD-001
type: requirement
title: Create Card
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card]
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-CREATE]
  requirements: []
  business_rules: [BR-LIST-001]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-CARD-CREATE-001]
  decisions: []
---

# Requirement

## Statement
A Workspace member must be able to create a Card in any non-archived List with just a title.

## Type
Functional

## Actor / Trigger
Workspace member; triggered from the board view's add-card control.

## Expected Behaviour
New cards append at the end of the target list.

## Rationale / Source
Core capture action of the product.

## Priority
P0

## Acceptance Criteria
- Given an active list, when a member adds a card with a valid title, then it appears at the end of that list.
- Given an archived list, when a member attempts to add a card, then the request is rejected.

## Dependencies
`FEAT-LIST-MANAGE`

## Related Business Rules
`BR-LIST-001`

## Verification
`TC-CARD-CREATE-001`
