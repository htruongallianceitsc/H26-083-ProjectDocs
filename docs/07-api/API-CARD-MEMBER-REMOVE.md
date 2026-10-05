---
code: API-CARD-MEMBER-REMOVE
type: api
title: Remove Card Member
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, member, card]
method: DELETE
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
Remove a member's assignment from a Card.

## Endpoint
- Method: `DELETE`
- Path: `/api/cards/{cardId}/members/{userId}`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be the target user themself, a workspace `owner`/`admin`, or any board member (per `BR-MEMBER-001`, unassignment is open to any workspace member — same permission level as assignment).

## Request
### Headers
`Authorization: Bearer <token>`
### Path Parameters
`cardId` (uuid, required), `userId` (uuid, required)
### Query Parameters
None
### Body
None

## Response
### Success
`204 No Content`
### Errors
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 CARD_NOT_FOUND`
- `409 CARD_ARCHIVED` (`BR-CARD-003`)

## Validation
None beyond existence/authorization.

## Business Rules Applied
`BR-CARD-003`

## Idempotency / Concurrency
Idempotent: removing a non-assigned member returns `204` as a no-op.

## Transaction Boundary
Delete from `DB-CARD-MEMBER` plus one `DB-ACTIVITY-LOG` insert (`action_type = member_removed`), in one transaction.

## Database Impact
### READ
`DB-CARD-MEMBER` (existence check)
### WRITE
`DB-CARD-MEMBER` (delete), `DB-ACTIVITY-LOG` (insert)

## External Dependencies
None.

## Logging / Audit
Recorded in `DB-ACTIVITY-LOG`.

## Performance / Rate Limit
Standard write-endpoint rate limit. Broadcasts `card.member_removed` over the board's WebSocket channel.

## Related Feature / Screen / Tests
`FEAT-MEMBER-ASSIGN-CARD`, `SCR-CARD-DETAIL`, `TC-MEMBER-ASSIGN-CARD-001`
