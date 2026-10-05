---
code: API-LABEL-UPDATE
type: api
title: Update Board Label
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, label]
method: PATCH
path: /api/labels/{labelId}
related:
  modules: [MOD-LABEL]
  features: [FEAT-LABEL-MANAGE]
  requirements: [REQ-LABEL-001]
  business_rules: [BR-LABEL-001]
  screens: [SCR-BOARD-SETTINGS]
  flows: []
  apis: []
  database_objects: [DB-LABEL]
  tests: [TC-LABEL-MANAGE-001]
  decisions: []
---

# API Contract

## Purpose
Rename and/or recolor an existing label.

## Endpoint
- Method: `PATCH`
- Path: `/api/labels/{labelId}`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be the owning Board's Workspace `owner`/`admin`, or the Board's creator.

## Request
### Headers
`Authorization: Bearer <token>`, `Content-Type: application/json`
### Path Parameters
`labelId` (uuid, required)
### Query Parameters
None
### Body
```json
{ "name": "Critical Bug", "color": "red" }
```
Both fields optional; at least one must be present.

## Response
### Success
`200 OK`
```json
{ "data": { "id": "uuid", "boardId": "uuid", "name": "Critical Bug", "color": "red", "updatedAt": "2026-10-05T09:05:00Z" } }
```
### Errors
- `400 VALIDATION_ERROR`
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 LABEL_NOT_FOUND`
- `409 LABEL_NAME_DUPLICATE` (`BR-LABEL-001`)

## Validation
Same as `API-LABEL-CREATE` for whichever fields are present.

## Business Rules Applied
`BR-LABEL-001`

## Idempotency / Concurrency
Idempotent: repeating the same update produces the same end state.

## Transaction Boundary
Single-row update.

## Database Impact
### READ
`DB-LABEL` (existence/authorization)
### WRITE
`DB-LABEL` (update)

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard write-endpoint rate limit.

## Related Feature / Screen / Tests
`FEAT-LABEL-MANAGE`, `SCR-BOARD-SETTINGS`, `TC-LABEL-MANAGE-001`
