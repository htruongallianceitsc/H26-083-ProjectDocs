---
code: API-CARD-GET-DETAIL
type: api
title: Get Card Detail
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, card]
method: GET
path: /api/cards/{cardId}
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-EDIT-DETAIL]
  requirements: [REQ-CARD-003]
  business_rules: []
  screens: [SCR-CARD-DETAIL]
  flows: []
  apis: []
  database_objects: [DB-CARD, DB-CARD-LABEL, DB-CARD-MEMBER]
  tests: []
  decisions: []
---

# API Contract

## Purpose
Fetch full detail for a single Card, including its label/member ids (comments and activity are paginated separately via `API-COMMENT-CREATE`'s list behavior and `API-ACTIVITY-LIST`).

## Endpoint
- Method: `GET`
- Path: `/api/cards/{cardId}`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be a member of the Card's Board's Workspace.

## Request
### Headers
`Authorization: Bearer <token>`
### Path Parameters
`cardId` (uuid, required)
### Query Parameters
None
### Body
None

## Response
### Success
`200 OK`
```json
{ "data": { "id": "uuid", "listId": "uuid", "boardId": "uuid", "title": "Fix login bug", "description": null, "dueDate": null, "position": 1.0, "labelIds": [], "memberIds": [], "archivedAt": null, "createdAt": "2026-10-05T09:00:00Z", "updatedAt": "2026-10-05T09:00:00Z" } }
```
### Errors
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 CARD_NOT_FOUND`

## Validation
None.

## Business Rules Applied
None (read-only; archived cards are still readable per `BR-CARD-003` exception).

## Idempotency / Concurrency
Read-only, naturally idempotent. `updatedAt` in the response is what the client must echo back on the next `API-CARD-UPDATE`/`API-CARD-MOVE` call for optimistic concurrency.

## Transaction Boundary
Single read query.

## Database Impact
### READ
`DB-CARD`, `DB-CARD-LABEL`, `DB-CARD-MEMBER`
### WRITE
None

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard read-endpoint rate limit.

## Related Feature / Screen / Tests
`FEAT-CARD-EDIT-DETAIL`, `SCR-CARD-DETAIL`
