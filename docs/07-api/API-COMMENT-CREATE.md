---
code: API-COMMENT-CREATE
type: api
title: Add Comment
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, comment]
method: POST
path: /api/cards/{cardId}/comments
related:
  modules: [MOD-COMMENT]
  features: [FEAT-COMMENT-ADD]
  requirements: [REQ-COMMENT-001]
  business_rules: [BR-CARD-003]
  screens: [SCR-CARD-DETAIL]
  flows: [FLOW-COMMENT-ACTIVITY]
  apis: []
  database_objects: [DB-COMMENT, DB-ACTIVITY-LOG]
  tests: [TC-COMMENT-ADD-001]
  decisions: []
---

# API Contract

## Purpose
Post a new comment on a Card.

## Endpoint
- Method: `POST`
- Path: `/api/cards/{cardId}/comments`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be a member of the Card's Board's Workspace.

## Request
### Headers
`Authorization: Bearer <token>`, `Content-Type: application/json`
### Path Parameters
`cardId` (uuid, required)
### Query Parameters
None
### Body
```json
{ "body": "Reproduced on Safari 17, filed a fix." }
```

## Response
### Success
`201 Created`
```json
{ "data": { "id": "uuid", "cardId": "uuid", "authorId": "uuid", "body": "Reproduced on Safari 17, filed a fix.", "editedAt": null, "createdAt": "2026-10-05T09:40:00Z" } }
```
### Errors
- `400 VALIDATION_ERROR`
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 CARD_NOT_FOUND`
- `409 CARD_ARCHIVED` (`BR-CARD-003`)

## Validation
`body`: required, 1-5000 chars.

## Business Rules Applied
`BR-CARD-003`

## Idempotency / Concurrency
Not idempotent (creates a new resource each call).

## Transaction Boundary
Insert `DB-COMMENT` row and one `DB-ACTIVITY-LOG` row (`action_type = comment_added`), in one transaction (`FLOW-COMMENT-ACTIVITY`).

## Database Impact
### READ
`DB-CARD` (existence/archived check)
### WRITE
`DB-COMMENT` (insert), `DB-ACTIVITY-LOG` (insert)

## External Dependencies
None.

## Logging / Audit
Recorded in `DB-ACTIVITY-LOG`.

## Performance / Rate Limit
Standard write-endpoint rate limit. Broadcasts `comment.created` over the board's WebSocket channel.

## Related Feature / Screen / Tests
`FEAT-COMMENT-ADD`, `SCR-CARD-DETAIL`, `TC-COMMENT-ADD-001`
