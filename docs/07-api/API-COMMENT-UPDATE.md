---
code: API-COMMENT-UPDATE
type: api
title: Edit Comment
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, comment]
method: PATCH
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
Edit the body of an existing comment.

## Endpoint
- Method: `PATCH`
- Path: `/api/comments/{commentId}`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be the comment's author or a workspace `owner`/`admin` (`BR-COMMENT-001`).

## Request
### Headers
`Authorization: Bearer <token>`, `Content-Type: application/json`
### Path Parameters
`commentId` (uuid, required)
### Query Parameters
None
### Body
```json
{ "body": "Reproduced on Safari 17 and Chrome 130, filed a fix." }
```

## Response
### Success
`200 OK`
```json
{ "data": { "id": "uuid", "body": "Reproduced on Safari 17 and Chrome 130, filed a fix.", "editedAt": "2026-10-05T09:45:00Z" } }
```
### Errors
- `400 VALIDATION_ERROR`
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN` (`BR-COMMENT-001`)
- `404 COMMENT_NOT_FOUND`

## Validation
`body`: required, 1-5000 chars.

## Business Rules Applied
`BR-COMMENT-001`

## Idempotency / Concurrency
Idempotent: reapplying the same body yields the same state (though `editedAt` is only set once per actual change in practice — re-saving identical text still updates `editedAt`, a minor acceptable simplification).

## Transaction Boundary
Single-row update.

## Database Impact
### READ
`DB-COMMENT` (existence/authorship check)
### WRITE
`DB-COMMENT` (`body`, `edited_at`)

## External Dependencies
None.

## Logging / Audit
Standard request logging (not separately itemized in `activity_log`).

## Performance / Rate Limit
Standard write-endpoint rate limit. Broadcasts `comment.updated` over the board's WebSocket channel.

## Related Feature / Screen / Tests
`FEAT-COMMENT-ADD`, `SCR-CARD-DETAIL`, `TC-COMMENT-ADD-001`
