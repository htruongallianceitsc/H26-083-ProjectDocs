---
code: DOC-RELEASE-PROCESS
type: document
title: Release Process
status: draft
owner: Engineering Lead
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [devops, release]
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
---

# Release Process

## Entry Criteria
All targeted features pass Definition of Ready/Done (`standards/definition-of-ready-done.md`); `npm run docs:all` passes with no errors; security checklist (`docs/10-security/security-checklist.md`) reviewed.

## Build / Package
CI builds the React SPA static bundle and the Node.js API image/package from the `main` branch.

## Migration
Database migrations (`docs/08-database/database-overview.md` migration process) run against UAT first, verified, then applied to PROD before the new API version is deployed (additive/backward-compatible migrations only, to support a safe rollback).

## Deployment
API deployed first (backward-compatible with the previous frontend build), then the frontend static bundle is published; this ordering avoids a window where the frontend calls an API shape that doesn't exist yet.

## Smoke Test
Manual pass of the core journey after deploy: register/login, create workspace, create board, create and move a card (`docs/01-product/user-journeys.md` Journey 1).

## Monitoring Window
Engineering Lead watches `docs/13-operations/monitoring.md` dashboards for 30 minutes post-deploy for elevated error rate or latency regression (`NFR-PERF-001`, `NFR-AVAIL-001`).

## Rollback Conditions
Any core journey smoke-test failure, or error rate/latency breaching `NFR-AVAIL-001`/`NFR-PERF-001` thresholds within the monitoring window, triggers an immediate rollback to the previous frontend build and (if the migration is non-additive) a database rollback per the migration's documented down-script.

## Documentation Closure
Per `standards/definition-of-ready-done.md` Documentation Done checklist: update `PROJECT_BLUEPRINT.md`/feature status if scope changed, record any new ADR, and confirm no stale documents were introduced (`npm run docs:all`).
