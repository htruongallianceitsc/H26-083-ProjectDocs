---
code: API-WORKSPACE-REMOVE-MEMBER
type: api
title: Remove Workspace Member
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, workspace]
method: DELETE
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
Remove a member from a Workspace.

## Endpoint
- Method: `DELETE`
- Path: `/api/workspaces/{workspaceId}/members/{userId}`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be `owner`/`admin` of `workspaceId`, or the target removing themself — except the `owner` cannot remove themself without an ownership-transfer step that does not exist yet, so self-removal by the owner is blocked (`BR-WORKSPACE-001`).

## Request
### Headers
`Authorization: Bearer <token>`
### Path Parameters
`workspaceId` (uuid, required), `userId` (uuid, required)
### Query Parameters
None
### Body
None

## Response
### Success
`204 No Content`
### Errors
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN` — caller lacks permission, or target is the owner
- `404 MEMBER_NOT_FOUND`

## Validation
None beyond existence/authorization.

## Business Rules Applied
`BR-WORKSPACE-001`

## Idempotency / Concurrency
Idempotent in effect: removing an already-removed member returns `404` on the second call, treated as success by the client.

## Transaction Boundary
Single-row delete. Card assignments (`DB-CARD-MEMBER`) referencing the removed user are NOT automatically cleaned up in v1 — they become stale references hidden by the application layer (known limitation, tracked for a follow-up cleanup job).

## Database Impact
### READ
`DB-WORKSPACE-MEMBER` (target + caller role check)
### WRITE
`DB-WORKSPACE-MEMBER` (delete)

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard write-endpoint rate limit.

## Related Feature / Screen / Tests
`FEAT-WORKSPACE-MANAGE-MEMBERS`, `SCR-WORKSPACE-SETTINGS`, `TC-WORKSPACE-MANAGE-MEMBERS-001`
