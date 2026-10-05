---
code: API-COMMENT-DELETE
type: api
title: Delete Comment
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, comment]
method: DELETE
path: /api/comments/{commentId}
related:
  modules: [MOD-COMMENT]
  features: [FEAT-COMMENT-ADD]
  requirements: [REQ-COMMENT-001]
  business_rules: [BR-COMMENT-001]
  screens: [SCR-CARD-DETAIL]
  flows: []
  apis: []
  database_objects: [DB-COMMENT]
  tests: [TC-COMMENT-ADD-001]
  decisions: []
---

# API Contract

## Purpose
Soft-delete a comment, replacing its content with a tombstone.

## Endpoint
- Method: `DELETE`
- Path: `/api/comments/{commentId}`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be the comment's author or a workspace `owner`/`admin` (`BR-COMMENT-001`).

## Request
### Headers
`Authorization: Bearer <token>`
### Path Parameters
`commentId` (uuid, required)
### Query Parameters
None
### Body
None

## Response
### Success
`204 No Content`
### Errors
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN` (`BR-COMMENT-001`)
- `404 COMMENT_NOT_FOUND`

## Validation
None beyond existence/authorization.

## Business Rules Applied
`BR-COMMENT-001`

## Idempotency / Concurrency
Idempotent in effect: deleting an already-deleted comment returns `404` on the second call (deleted comments are excluded from the normal lookup used for authorization), treated as success by the client.

## Transaction Boundary
Single-row update (`deleted_at`), not a physical delete.

## Database Impact
### READ
`DB-COMMENT` (existence/authorship check)
### WRITE
`DB-COMMENT` (`deleted_at`)

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard write-endpoint rate limit. Broadcasts `comment.deleted` over the board's WebSocket channel.

## Related Feature / Screen / Tests
`FEAT-COMMENT-ADD`, `SCR-CARD-DETAIL`, `TC-COMMENT-ADD-001`
