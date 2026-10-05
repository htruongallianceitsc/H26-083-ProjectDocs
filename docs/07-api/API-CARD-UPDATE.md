---
code: API-CARD-UPDATE
type: api
title: Update Card Detail
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, card]
method: PATCH
path: /api/cards/{cardId}
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-EDIT-DETAIL]
  requirements: [REQ-CARD-003]
  business_rules: [BR-CARD-002, BR-CARD-003]
  screens: [SCR-CARD-DETAIL]
  flows: []
  apis: []
  database_objects: [DB-CARD]
  tests: [TC-CARD-EDIT-DETAIL-001]
  decisions: []
---

# API Contract

## Purpose
Update a Card's title, description, and/or due date.

## Endpoint
- Method: `PATCH`
- Path: `/api/cards/{cardId}`
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
{ "title": "Fix login bug on Safari", "description": "Repro steps...", "dueDate": "2026-10-10" }
```
All fields optional; `dueDate: null` clears it.

## Response
### Success
`200 OK`
```json
{ "data": { "id": "uuid", "title": "Fix login bug on Safari", "description": "Repro steps...", "dueDate": "2026-10-10", "updatedAt": "2026-10-05T09:30:00Z" } }
```
### Errors
- `400 VALIDATION_ERROR` (incl. `BR-CARD-002` due date violation)
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 CARD_NOT_FOUND`
- `409 CARD_ARCHIVED` (`BR-CARD-003`)

## Validation
`title`: 1-200 chars if present. `dueDate`: valid date, on/after `created_at` date, if present (`BR-CARD-002`).

## Business Rules Applied
`BR-CARD-002`, `BR-CARD-003`

## Idempotency / Concurrency
Idempotent: reapplying the same body yields the same state. Does not require the `updatedAt` concurrency check that `API-CARD-MOVE` uses — field edits are last-write-wins in v1 (acceptable risk given description/title edits are rarely concurrent; flagged as a lighter concurrency model than the move endpoint).

## Transaction Boundary
Single-row update.

## Database Impact
### READ
`DB-CARD` (existence/authorization, archived check)
### WRITE
`DB-CARD` (update)

## External Dependencies
None.

## Logging / Audit
Standard request logging; not individually itemized in `activity_log` in v1 (see `FEAT-CARD-EDIT-DETAIL` known limitations).

## Performance / Rate Limit
Standard write-endpoint rate limit. Broadcasts `card.updated` over the board's WebSocket channel.

## Related Feature / Screen / Tests
`FEAT-CARD-EDIT-DETAIL`, `SCR-CARD-DETAIL`, `TC-CARD-EDIT-DETAIL-001`
