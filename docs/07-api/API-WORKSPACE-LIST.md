---
code: API-WORKSPACE-LIST
type: api
title: List My Workspaces
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, workspace]
method: GET
path: /api/workspaces
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-CREATE]
  requirements: [REQ-WORKSPACE-001]
  business_rules: []
  screens: [SCR-WORKSPACE-HOME]
  flows: []
  apis: []
  database_objects: [DB-WORKSPACE, DB-WORKSPACE-MEMBER]
  tests: [TC-WORKSPACE-CREATE-001]
  decisions: []
---

# API Contract

## Purpose
List every Workspace the caller is a member of.

## Endpoint
- Method: `GET`
- Path: `/api/workspaces`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required.

## Request
### Headers
`Authorization: Bearer <token>`
### Path Parameters
None
### Query Parameters
`limit`, `cursor` (see `docs/07-api/conventions.md` pagination)
### Body
None

## Response
### Success
`200 OK`
```json
{ "data": [ { "id": "uuid", "name": "Acme Team", "role": "owner" } ], "meta": { "nextCursor": null } }
```
### Errors
- `401 UNAUTHENTICATED`

## Validation
None.

## Business Rules Applied
None.

## Idempotency / Concurrency
Read-only, naturally idempotent.

## Transaction Boundary
Single read query (join `DB-WORKSPACE` and `DB-WORKSPACE-MEMBER` on the caller's user id).

## Database Impact
### READ
`DB-WORKSPACE`, `DB-WORKSPACE-MEMBER`
### WRITE
None

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard read-endpoint rate limit; cached client-side for the workspace switcher.

## Related Feature / Screen / Tests
`FEAT-WORKSPACE-CREATE`, `SCR-WORKSPACE-HOME`, `TC-WORKSPACE-CREATE-001`
