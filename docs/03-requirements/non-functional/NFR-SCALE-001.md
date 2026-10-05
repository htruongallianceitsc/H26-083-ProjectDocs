---
code: NFR-SCALE-001
type: nfr
title: Target Scale for MVP
status: draft
owner: Engineering Lead
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [scalability]
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
  decisions: [ADR-001]
---

# Non-Functional Requirement

## Category
Scalability

## Requirement
The system must comfortably support the MVP's expected initial usage without requiring architectural changes (sharding, read replicas, caching layer).

## Metric
Supported concurrent workspaces/boards/cards at target performance (`NFR-PERF-001`).

## Target
Up to ~200 members per workspace, a few thousand cards per board, and a few hundred concurrently active WebSocket connections per deployment, on a single PostgreSQL primary and a single (horizontally scalable, stateless-except-WebSocket) API deployment.

## Measurement Method
Load testing against representative synthetic data volumes before the first production release.

## Scope
Whole system.

## Failure Threshold
Performance degradation below `NFR-PERF-001` targets at the stated scale requires a design review before release.

## Verification / Test
Load test suite exercising `API-BOARD-GET-DETAIL` and `API-CARD-MOVE` at target data volumes.
