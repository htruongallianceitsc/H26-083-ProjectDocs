---
code: API-ACTIVITY-LIST
type: api
title: List Card Activity
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, activity]
method: GET
path: /api/cards/{cardId}/activity
related:
  modules: [MOD-COMMENT]
  features: [FEAT-ACTIVITY-LOG]
  requirements: [REQ-COMMENT-002]
  business_rules: []
  screens: [SCR-CARD-DETAIL]
  flows: [FLOW-CARD-MOVE-DRAGDROP, FLOW-COMMENT-ACTIVITY]
  apis: []
  database_objects: [DB-ACTIVITY-LOG]
  tests: [TC-ACTIVITY-LOG-001]
  decisions: []
---

# API Contract

## Purpose
Return a Card's activity feed, newest first.

## Endpoint
- Method: `GET`
- Path: `/api/cards/{cardId}/activity`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be a member of the Card's Board's Workspace.

## Request
### Headers
`Authorization: Bearer <token>`
### Path Parameters
`cardId` (uuid, required)
### Query Parameters
`limit`, `cursor` (see `docs/07-api/conventions.md` pagination)
### Body
None

## Response
### Success
`200 OK`
```json
{ "data": [ { "id": "uuid", "actorId": "uuid", "actionType": "card_moved", "metadata": { "fromListId": "uuid", "toListId": "uuid" }, "createdAt": "2026-10-05T09:31:00Z" } ], "meta": { "nextCursor": null } }
```
### Errors
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 CARD_NOT_FOUND`

## Validation
None.

## Business Rules Applied
None (read-only).

## Idempotency / Concurrency
Read-only, naturally idempotent.

## Transaction Boundary
Single read query, ordered by `created_at DESC`.

## Database Impact
### READ
`DB-ACTIVITY-LOG`
### WRITE
None

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard read-endpoint rate limit; indexed on `(card_id, created_at)` (see `DB-ACTIVITY-LOG`).

## Related Feature / Screen / Tests
`FEAT-ACTIVITY-LOG`, `SCR-CARD-DETAIL`, `TC-ACTIVITY-LOG-001`
