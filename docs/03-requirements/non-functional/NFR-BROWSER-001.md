---
code: NFR-BROWSER-001
type: nfr
title: Supported Browsers and Viewport
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [compatibility, frontend]
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
  decisions: [ADR-006]
---

# Non-Functional Requirement

## Category
Compatibility

## Requirement
The web app must work correctly on evergreen modern browsers and remain usable down to tablet width.

## Metric
Supported browser list and minimum viewport width.

## Target
Latest two major versions of Chrome, Edge, Firefox, and Safari (desktop and tablet). Usable (not necessarily optimized) down to 768px viewport width; phone-width optimization is out of scope for v1 (`docs/00-project/product-scope.md`).

## Measurement Method
Manual cross-browser QA pass before each release; automated visual regression on Chrome as the primary CI browser.

## Scope
All `SCR-*` screens.

## Failure Threshold
Any core flow (login, board drag-and-drop, card detail) broken on a supported browser blocks release.

## Verification / Test
Manual QA checklist run against the supported browser matrix before release.
