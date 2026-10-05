---
code: DOC-TESTING-STRATEGY
type: document
title: Testing Strategy
status: draft
owner: QA / Test Engineers
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [quality, testing]
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

# Testing Strategy

## Levels
- **Unit** — business-rule logic in the service layer (`ARCH-003`), isolated from HTTP/DB (e.g. position-recomputation logic behind `BR-LIST-002`).
- **Integration** — API endpoint tests against a real test database for every endpoint in `docs/07-api/`, asserting the request/response contract and database side effects (`docs/08-database/`).
- **End-to-end** — scripted browser tests covering the user journeys in `docs/01-product/user-journeys.md`, run against at least Chromium (`NFR-BROWSER-001`).
- **Manual/exploratory** — drag-and-drop feel, realtime multi-browser verification, accessibility keyboard-only pass (`NFR-A11Y-001`).

## Coverage Policy
Every `feature` entity must have at least one linked `test-case` (enforced by `registry/quality-rules.json` `feature-test` rule); see the per-feature test cases under `docs/11-quality/test-cases/`.

## Realtime / Concurrency Testing
`FLOW-CARD-MOVE-DRAGDROP`'s conflict path (`TC-CARD-MOVE-002`) is tested by simulating two concurrent `API-CARD-MOVE` calls with a stale `updatedAt` and asserting the second returns `409`.

## Regression
The smoke-test subset of end-to-end tests (`docs/12-devops/release-process.md`) runs on every release; the full suite runs on every merge to `main`.

## Accessibility
Manual keyboard-only and screen-reader pass against `SCR-BOARD` before release, per `NFR-A11Y-001`.

## Browser / Device Support
See `NFR-BROWSER-001`.
