---
code: API-CARD-MEMBER-ASSIGN
type: api
title: Assign Card Member
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, member, card]
method: POST
path: /api/cards/{cardId}/members/{userId}
related:
  modules: [MOD-MEMBER]
  features: [FEAT-MEMBER-ASSIGN-CARD]
  requirements: [REQ-MEMBER-001]
  business_rules: [BR-MEMBER-001]
  screens: [SCR-CARD-DETAIL]
  flows: []
  apis: []
  database_objects: [DB-CARD-MEMBER, DB-ACTIVITY-LOG]
  tests: [TC-MEMBER-ASSIGN-CARD-001]
  decisions: []
---

# API Contract

## Purpose
Assign a Workspace member to a Card.

## Endpoint
- Method: `POST`
- Path: `/api/cards/{cardId}/members/{userId}`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be a member of the Card's Board's Workspace.

## Request
### Headers
`Authorization: Bearer <token>`
### Path Parameters
`cardId` (uuid, required), `userId` (uuid, required — the user to assign)
### Query Parameters
None
### Body
None

## Response
### Success
`201 Created`
```json
{ "data": { "cardId": "uuid", "userId": "uuid" } }
```
If already assigned, returns `200 OK` with the same body (idempotent).
### Errors
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN` — caller not a workspace member
- `403 USER_NOT_WORKSPACE_MEMBER` — target not a workspace member (`BR-MEMBER-001`)
- `404 CARD_NOT_FOUND`
- `409 CARD_ARCHIVED` (`BR-CARD-003`)

## Validation
`userId` must resolve to a member of the card's board's workspace.

## Business Rules Applied
`BR-MEMBER-001`, `BR-CARD-003`

## Idempotency / Concurrency
Idempotent: assigning an already-assigned user is a no-op success.

## Transaction Boundary
Insert into `DB-CARD-MEMBER` plus one `DB-ACTIVITY-LOG` insert (`action_type = member_assigned`), in one transaction.

## Database Impact
### READ
`DB-CARD`, `DB-WORKSPACE-MEMBER` (target membership check)
### WRITE
`DB-CARD-MEMBER` (insert), `DB-ACTIVITY-LOG` (insert)

## External Dependencies
None.

## Logging / Audit
Recorded in `DB-ACTIVITY-LOG`.

## Performance / Rate Limit
Standard write-endpoint rate limit. Broadcasts `card.member_assigned` over the board's WebSocket channel.

## Related Feature / Screen / Tests
`FEAT-MEMBER-ASSIGN-CARD`, `SCR-CARD-DETAIL`, `TC-MEMBER-ASSIGN-CARD-001`
