---
code: API-WORKSPACE-INVITE-MEMBER
type: api
title: Invite Workspace Member
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, workspace]
method: POST
path: /api/workspaces/{workspaceId}/members
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-MANAGE-MEMBERS]
  requirements: [REQ-WORKSPACE-002]
  business_rules: [BR-WORKSPACE-001, BR-WORKSPACE-002]
  screens: [SCR-WORKSPACE-SETTINGS]
  flows: [FLOW-WORKSPACE-INVITE-MEMBER]
  apis: []
  database_objects: [DB-WORKSPACE-MEMBER, DB-USER]
  tests: [TC-WORKSPACE-MANAGE-MEMBERS-001]
  decisions: []
---

# API Contract

## Purpose
Invite a registered user into a Workspace as a `member`.

## Endpoint
- Method: `POST`
- Path: `/api/workspaces/{workspaceId}/members`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be `owner`/`admin` of `workspaceId` (`BR-WORKSPACE-001`).

## Request
### Headers
`Authorization: Bearer <token>`, `Content-Type: application/json`
### Path Parameters
`workspaceId` (uuid, required)
### Query Parameters
None
### Body
```json
{ "email": "newmember@example.com" }
```

## Response
### Success
`201 Created`
```json
{ "data": { "userId": "uuid", "email": "newmember@example.com", "role": "member" } }
```
### Errors
- `400 VALIDATION_ERROR`
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 WORKSPACE_NOT_FOUND`
- `404 INVITE_USER_NOT_FOUND` — no account exists for this email
- `409 ALREADY_MEMBER` (`BR-WORKSPACE-002`)

## Validation
`email`: required, valid format.

## Business Rules Applied
`BR-WORKSPACE-001`, `BR-WORKSPACE-002`

## Idempotency / Concurrency
Not idempotent on success (creates a membership row); the `UNIQUE (workspace_id, user_id)` constraint is the concurrency guard against double-invite races.

## Transaction Boundary
Insert `DB-WORKSPACE-MEMBER` row, then enqueue the invite email.

## Database Impact
### READ
`DB-USER` (resolve email to user id), `DB-WORKSPACE-MEMBER` (duplicate check), caller's own role check
### WRITE
`DB-WORKSPACE-MEMBER` (insert)

## External Dependencies
`INT-EMAIL` (invite notification).

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard write-endpoint rate limit.

## Related Feature / Screen / Tests
`FEAT-WORKSPACE-MANAGE-MEMBERS`, `SCR-WORKSPACE-SETTINGS`, `TC-WORKSPACE-MANAGE-MEMBERS-001`
