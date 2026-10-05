---
code: API-CARD-ARCHIVE
type: api
title: Archive Card
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, card]
method: POST
path: /api/cards/{cardId}/archive
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-ARCHIVE]
  requirements: [REQ-CARD-004]
  business_rules: [BR-CARD-003]
  screens: [SCR-CARD-DETAIL, SCR-BOARD]
  flows: []
  apis: []
  database_objects: [DB-CARD, DB-ACTIVITY-LOG]
  tests: [TC-CARD-ARCHIVE-001]
  decisions: [ADR-005]
---

# API Contract

## Purpose
Soft-delete (archive) a Card.

## Endpoint
- Method: `POST`
- Path: `/api/cards/{cardId}/archive`
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
{ "data": { "id": "uuid", "archivedAt": "2026-10-05T09:35:00Z" } }
```
### Errors
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 CARD_NOT_FOUND`
- `409 ALREADY_ARCHIVED`

## Validation
None beyond existence/authorization.

## Business Rules Applied
`BR-CARD-003` (effect of this action).

## Idempotency / Concurrency
Not idempotent in the strict sense (second call returns `409 ALREADY_ARCHIVED`), safe to retry — client treats that as success.

## Transaction Boundary
Update `archived_at` and insert one `DB-ACTIVITY-LOG` row (`action_type = card_archived`), in one transaction.

## Database Impact
### READ
`DB-CARD` (existence/authorization)
### WRITE
`DB-CARD` (`archived_at`), `DB-ACTIVITY-LOG` (insert)

## External Dependencies
None.

## Logging / Audit
Recorded in `DB-ACTIVITY-LOG`.

## Performance / Rate Limit
Standard write-endpoint rate limit. Broadcasts `card.archived` over the board's WebSocket channel.

## Related Feature / Screen / Tests
`FEAT-CARD-ARCHIVE`, `SCR-CARD-DETAIL`, `SCR-BOARD`, `TC-CARD-ARCHIVE-001`
