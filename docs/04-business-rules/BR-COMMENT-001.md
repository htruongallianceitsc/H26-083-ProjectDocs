---
code: BR-COMMENT-001
type: business-rule
title: Comment Edit/Delete Permission and Soft Delete
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [comment]
related:
  modules: [MOD-COMMENT]
  features: [FEAT-COMMENT-ADD]
  requirements: [REQ-COMMENT-001]
  business_rules: []
  screens: [SCR-CARD-DETAIL]
  flows: []
  apis: [API-COMMENT-UPDATE, API-COMMENT-DELETE]
  database_objects: [DB-COMMENT]
  tests: [TC-COMMENT-ADD-001]
  decisions: []
---

# Business Rule

## Rule Statement
Only a comment's author, or a workspace `owner`/`admin`, may edit or delete it. An edited comment is marked with `edited_at`, shown to users as "(edited)". A deleted comment is soft-deleted (`deleted_at` set) and rendered as a tombstone ("This comment was deleted") rather than removed outright.

## Conditions
Checked on `API-COMMENT-UPDATE` and `API-COMMENT-DELETE`.

## Result / Constraint
A caller who is neither the author nor an owner/admin receives `403 FORBIDDEN`.

## Exceptions
None.

## Scope / Effective Context
Per-comment.

## Positive Examples
The author edits their own typo; a workspace admin deletes an off-topic comment by someone else.

## Negative Examples
A regular member (not the author, not owner/admin) tries to delete someone else's comment -> rejected.

## Error / Message
`FORBIDDEN` — "You can only edit or delete your own comments."

## Affected Features / Requirements / APIs / Screens
`FEAT-COMMENT-ADD`, `REQ-COMMENT-001`, `API-COMMENT-UPDATE`, `API-COMMENT-DELETE`, `SCR-CARD-DETAIL`

## Test Coverage
`TC-COMMENT-ADD-001`
