---
code: API-WORKSPACE-UPDATE-MEMBER-ROLE
type: api
title: Update Workspace Member Role
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, workspace]
method: PATCH
path: /api/workspaces/{workspaceId}/members/{userId}
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-MANAGE-MEMBERS]
  requirements: [REQ-WORKSPACE-002]
  business_rules: [BR-WORKSPACE-001]
  screens: [SCR-WORKSPACE-SETTINGS]
  flows: []
  apis: []
  database_objects: [DB-WORKSPACE-MEMBER]
  tests: [TC-WORKSPACE-MANAGE-MEMBERS-001]
  decisions: []
---

# API Contract

## Purpose
Change a member's role within a Workspace.

## Endpoint
- Method: `PATCH`
- Path: `/api/workspaces/{workspaceId}/members/{userId}`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be `owner`/`admin` of `workspaceId` (`BR-WORKSPACE-001`).

## Request
### Headers
`Authorization: Bearer <token>`, `Content-Type: application/json`
### Path Parameters
`workspaceId` (uuid, required), `userId` (uuid, required)
### Query Parameters
None
### Body
```json
{ "role": "admin" }
```

## Response
### Success
`200 OK`
```json
{ "data": { "userId": "uuid", "role": "admin" } }
```
### Errors
- `400 VALIDATION_ERROR` — `role` not one of `admin`/`member` (setting `owner` directly is not allowed)
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN` — caller not owner/admin, or target is the current owner (`BR-WORKSPACE-001`)
- `404 MEMBER_NOT_FOUND`

## Validation
`role` must be `admin` or `member`.

## Business Rules Applied
`BR-WORKSPACE-001`

## Idempotency / Concurrency
Idempotent: setting the same role twice is a no-op.

## Transaction Boundary
Single-row update.

## Database Impact
### READ
`DB-WORKSPACE-MEMBER` (target + caller role check)
### WRITE
`DB-WORKSPACE-MEMBER` (update `role`)

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard write-endpoint rate limit.

## Related Feature / Screen / Tests
`FEAT-WORKSPACE-MANAGE-MEMBERS`, `SCR-WORKSPACE-SETTINGS`, `TC-WORKSPACE-MANAGE-MEMBERS-001`
