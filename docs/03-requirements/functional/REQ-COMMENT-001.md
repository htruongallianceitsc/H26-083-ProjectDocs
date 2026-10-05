---
code: REQ-COMMENT-001
type: requirement
title: Add, Edit, and Delete Comments
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [comment]
related:
  modules: [MOD-COMMENT]
  features: [FEAT-COMMENT-ADD]
  requirements: []
  business_rules: [BR-COMMENT-001]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-COMMENT-ADD-001]
  decisions: []
---

# Requirement

## Statement
Any Workspace member must be able to comment on a Card; only the comment's author or a workspace owner/admin may edit or delete it.

## Type
Functional

## Actor / Trigger
Workspace member; triggered from the card detail comment composer.

## Expected Behaviour
Comments appear chronologically; edits are marked; deletes leave a tombstone.

## Rationale / Source
Core discussion workflow requested by the product owner.

## Priority
P1

## Acceptance Criteria
- Given a card, when a member posts a comment, then it appears in the thread.
- Given a comment by another user, when a non-author, non-owner/admin tries to edit/delete it, then the request is rejected.

## Dependencies
`FEAT-CARD-CREATE`

## Related Business Rules
`BR-COMMENT-001`

## Verification
`TC-COMMENT-ADD-001`
