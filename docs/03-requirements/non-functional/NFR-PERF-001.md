---
code: NFR-PERF-001
type: nfr
title: API Response Time
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
  screens: []
  flows: []
  apis: [API-BOARD-GET-DETAIL, API-CARD-MOVE]
  database_objects: []
  tests: []
  decisions: []
---

# Non-Functional Requirement

## Category
Performance

## Requirement
Core read and write API endpoints must respond quickly enough to keep the board interaction feeling instantaneous.

## Metric
P95 response time, measured server-side.

## Target
`API-BOARD-GET-DETAIL`: P95 < 500ms for boards up to 500 cards. `API-CARD-MOVE`, `API-LIST-REORDER`, and other single-row write endpoints: P95 < 200ms.

## Measurement Method
Application performance monitoring (APM) on the API, reviewed per release.

## Scope
All endpoints in `docs/07-api/`.

## Failure Threshold
P95 exceeding target for more than 1 hour triggers an investigation per `docs/13-operations/monitoring.md`.

## Verification / Test
Load test against `API-BOARD-GET-DETAIL` and `API-CARD-MOVE` with representative data volumes before each release.
