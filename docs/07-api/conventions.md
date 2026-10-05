---
code: DOC-API-CONVENTIONS
type: document
title: API Conventions
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, conventions]
related:
  modules: []
  features: []
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: []
  decisions: [ADR-002]
  integrations: []
  nfrs: [NFR-PERF-001]
  runbooks: []
  permissions: []
  native_capabilities: []
  deep_links: []
  push_events: []
  local_storage: []
  sync_policies: []
  background_jobs_mobile: []
  analytics_events: []
  feature_flags: []
  device_test_profiles: []
  open_questions: []
  releases: []
---

# API Conventions

## Versioning
All endpoints are prefixed `/api/v1/...`. A breaking change ships as `/api/v2/...`; the Blueprint/API docs in this round omit the `/v1` prefix for brevity but it is implied on every path (e.g. `POST /api/auth/login` means `POST /api/v1/auth/login`).

## Auth Headers
Authenticated requests send `Authorization: Bearer <access_token>` (short-lived JWT, see `ADR-002`). The refresh token is stored in an httpOnly, `SameSite=Strict` cookie and is never read by frontend JavaScript (see `docs/10-security/authentication.md`).

## Response Envelope
Success:
```json
{ "data": { }, "meta": { } }
```
`meta` carries pagination info when present (see Pagination below). Single-resource responses omit `meta` when empty.

## Error Envelope
```json
{ "error": { "code": "RESOURCE_NOT_FOUND", "message": "Card not found", "details": {} } }
```
`code` is a stable, machine-readable upper-snake-case string (also documented per-endpoint under "Errors"). `message` is human-readable and safe to show in a toast. `details` is optional, used mainly for validation errors (field-level messages).

## Pagination / Filtering / Sorting
List endpoints (e.g. `API-WORKSPACE-LIST`) use cursor-based pagination: `?limit=20&cursor=<opaque>`. Response `meta` includes `nextCursor` (null when no more pages). Sorting/filtering query parameters are documented per endpoint; unsupported parameters are ignored, not errored.

## Date / Time / Timezone
All timestamps in requests/responses are ISO-8601 UTC (`2026-10-05T09:00:00Z`). Date-only fields (e.g. Card `dueDate`) are `YYYY-MM-DD` with no timezone component; the client renders them in the viewer's local timezone.

## Idempotency
Mutating endpoints that are safe to retry (e.g. `API-CARD-MOVE`) accept an `updatedAt` (or equivalent version) field in the request body to make retries a safe no-op / detect conflicts (see each endpoint's "Idempotency / Concurrency" section). Endpoints are not required to support a client-generated `Idempotency-Key` header in v1.

## Correlation / Request IDs
Every response includes an `X-Request-Id` header (generated server-side if the client does not send one) echoed into `activity_log`/error logs for traceability (see `docs/13-operations/monitoring.md`).

## Retry Semantics
Clients should retry `5xx` and network errors with exponential backoff (base 500ms, up to 3 attempts). `4xx` errors (except `429`) are not retried automatically. `429 Too Many Requests` includes a `Retry-After` header.

## Realtime Channel
In addition to REST, the backend exposes a WebSocket endpoint (`/ws/boards/{boardId}`) that broadcasts change events (`card.moved`, `card.created`, `card.archived`, `list.reordered`, `label.assigned`, `comment.created`, etc.) to all clients subscribed to that Board. See `ARCH-004` and `FLOW-CARD-MOVE-DRAGDROP`.
