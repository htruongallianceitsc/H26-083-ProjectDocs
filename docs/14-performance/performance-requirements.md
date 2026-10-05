---
code: DOC-PERFORMANCE-REQUIREMENTS
type: document
title: Performance Requirements
status: draft
owner: Engineering Lead
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [performance]
related:
  modules: []
  features: []
  requirements: []
  business_rules: []
  screens: [SCR-BOARD]
  flows: []
  apis: [API-BOARD-GET-DETAIL, API-CARD-MOVE]
  database_objects: [DB-CARD]
  tests: []
  decisions: []
  integrations: []
  nfrs: [NFR-PERF-001, NFR-PERF-002, NFR-SCALE-001]
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

# Performance Requirements

This document consolidates the performance targets defined as NFRs and names where they are enforced.

| Target | NFR | Enforced At |
|---|---|---|
| API p95 < 300ms (simple CRUD) | `NFR-PERF-001` | All endpoints in `docs/07-api/` |
| `API-BOARD-GET-DETAIL` p95 < 500ms up to 1,000 cards | `NFR-PERF-001` | Board open/load |
| `API-CARD-MOVE` p95 < 250ms | `NFR-PERF-001` | Drag-and-drop persistence |
| Realtime event delivery p95 < 500ms | `NFR-PERF-002` | WebSocket broadcast (`ARCH-004`) |
| Up to 2,000 active cards per board at target latency | `NFR-SCALE-001` | `DB-CARD` indexing, board view virtualization (`ARCH-002`) |

## Database Performance
Query plans for `API-BOARD-GET-DETAIL` (the single most expensive read — nested lists+cards) are reviewed whenever a new filter, sort, or join is added, per `docs/08-database/database-overview.md`.

## API Performance
See `NFR-PERF-001`.

## Frontend Performance
The Board screen (`SCR-BOARD`) virtualizes card rendering for long lists to keep interaction responsive at the `NFR-SCALE-001` card-count target; see `docs/09-architecture/frontend-architecture.md`.
