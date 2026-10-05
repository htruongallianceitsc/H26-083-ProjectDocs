---
code: API-LABEL-DELETE
type: api
title: Delete Board Label
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, label]
method: DELETE
path: /api/labels/{labelId}
related:
  modules: [MOD-LABEL]
  features: [FEAT-LABEL-MANAGE]
  requirements: [REQ-LABEL-001]
  business_rules: [BR-LABEL-001]
  screens: [SCR-BOARD-SETTINGS]
  flows: []
  apis: []
  database_objects: [DB-LABEL, DB-CARD-LABEL]
  tests: [TC-LABEL-MANAGE-001]
  decisions: []
---

# API Contract

## Purpose
Permanently delete a label from its Board, removing it from every Card that had it.

## Endpoint
- Method: `DELETE`
- Path: `/api/labels/{labelId}`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be the owning Board's Workspace `owner`/`admin`, or the Board's creator.

## Request
### Headers
`Authorization: Bearer <token>`
### Path Parameters
`labelId` (uuid, required)
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
- `404 LABEL_NOT_FOUND`

## Validation
None beyond existence/authorization.

## Business Rules Applied
None beyond permission check.

## Idempotency / Concurrency
Idempotent in effect: deleting an already-deleted label returns `404 LABEL_NOT_FOUND` on the second call, which the client treats as success (resource no longer exists).

## Transaction Boundary
Deleting the `DB-LABEL` row; `DB-CARD-LABEL` rows referencing it are removed automatically via `ON DELETE CASCADE` in the same database transaction.

## Database Impact
### READ
`DB-LABEL` (existence/authorization)
### WRITE
`DB-LABEL` (delete), `DB-CARD-LABEL` (cascade delete)

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard write-endpoint rate limit.

## Related Feature / Screen / Tests
`FEAT-LABEL-MANAGE`, `SCR-BOARD-SETTINGS`, `TC-LABEL-MANAGE-001`
