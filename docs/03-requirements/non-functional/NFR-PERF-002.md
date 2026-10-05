---
code: NFR-PERF-002
type: nfr
title: Realtime Board Sync Latency
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [performance, realtime]
related:
  modules: [MOD-CARD]
  features: []
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: []
  decisions: [ADR-004]
---

# Non-Functional Requirement

## Category
Performance / Realtime

## Requirement
When one user changes a Board (moves/creates/archives a Card, reorders a List, adds a comment), every other client currently viewing that Board must see the change without a manual refresh, within a bounded delay.

## Metric
Time from the write transaction committing on the server to the WebSocket event being delivered to a connected client (p95).

## Target
p95 < 500ms for clients with a healthy WebSocket connection.

## Measurement Method
Server-side timestamp on broadcast, synthetic client measuring receive timestamp in a scripted multi-client test.

## Scope
`ARCH-004` realtime channel and all card/list/comment write APIs that broadcast events.

## Failure Threshold
p95 > 2s for a sustained window, or WebSocket disconnect rate above 5%, triggers an alert.

## Verification / Test
Manual two-browser verification during QA for `TC-CARD-MOVE-001`; automated synthetic multi-client check as a future CI addition.
