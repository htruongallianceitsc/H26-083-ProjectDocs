---
code: DOC-MONITORING
type: document
title: Monitoring
status: draft
owner: Engineering Lead
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [operations, monitoring]
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
  decisions: []
  integrations: []
  nfrs: [NFR-PERF-001, NFR-PERF-002, NFR-AVAIL-001]
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

# Monitoring

## Service Health
`GET /health` endpoint polled every minute by an external uptime monitor (`NFR-AVAIL-001`); checks API process liveness and a lightweight database connectivity ping.

## API Metrics
Per-endpoint request count, error rate (4xx/5xx), and p50/p95/p99 latency, tagged by route (`docs/07-api/conventions.md` endpoints), tracked against `NFR-PERF-001`.

## Database Metrics
Connection pool utilization, query latency, slow-query log (queries > 200ms), table/index bloat — reviewed whenever a new query pattern is added (`docs/08-database/database-overview.md`).

## Frontend Metrics
Client-side error reporting (uncaught exceptions, failed API calls) and Core Web Vitals (LCP/INP) for the Board screen, the highest-traffic view.

## Queue / Background Jobs
No background job queue exists in v1 (all writes are synchronous within the request); this section will be populated if a future notification/digest job (`OQ-005`) is added.

## External Integrations
`INT-EMAIL` send success/failure rate and latency.

## Dashboards
A single operational dashboard aggregates: API latency/error rate, WebSocket connection count and realtime event delivery latency (`NFR-PERF-002`), and database health.

## Alerts
- API p95 latency breaching `NFR-PERF-001` target for 15 minutes.
- Error rate > 5% for 5 minutes.
- Uptime check failure for 3 consecutive checks (`NFR-AVAIL-001`).
- `INT-EMAIL` failure rate > 10% over 1 hour.
