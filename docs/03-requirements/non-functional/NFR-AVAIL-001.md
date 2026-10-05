---
code: NFR-AVAIL-001
type: nfr
title: Service Availability
status: draft
owner: Engineering Lead
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [availability]
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

# Non-Functional Requirement

## Category
Availability

## Requirement
The API and WebSocket service must be available for normal use during business hours across supported time zones.

## Metric
Monthly uptime percentage (successful health-check ratio).

## Target
99.5% monthly uptime for the MVP (single-region, single-primary-database deployment; no multi-region failover in v1).

## Measurement Method
External uptime monitor hitting a `/health` endpoint every minute; incidents tracked per `docs/13-operations/incident-response.md`.

## Scope
API, WebSocket channel, and frontend static hosting.

## Failure Threshold
Any outage longer than 15 minutes triggers the incident-response process.

## Verification / Test
Reviewed monthly against the uptime monitor's report.
