---
code: DOC-INCIDENT-RESPONSE
type: document
title: Incident Response
status: draft
owner: Engineering Lead
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [operations, incident]
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
  nfrs: [NFR-AVAIL-001]
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

# Incident Response

## Severity Levels
- **SEV-1** — Full outage (app or API unreachable, or data loss risk). Page immediately.
- **SEV-2** — Core journey broken for some users (e.g. card move failing) but app otherwise reachable.
- **SEV-3** — Degraded performance (latency above `NFR-PERF-001` target) or a non-core feature broken.

## Detection & Triage
Alerts from `docs/13-operations/monitoring.md` (uptime check, error rate, latency) or a user report. Engineering Lead (or on-call) confirms severity within 10 minutes.

## Communication
Internal status update posted to the engineering channel at detection, every 30 minutes during a SEV-1/SEV-2, and at resolution.

## Mitigation
Follow `docs/12-devops/release-process.md` rollback conditions if the incident correlates with a recent deploy; otherwise investigate via `docs/13-operations/monitoring.md` dashboards and logs (scrubbed of secrets per `docs/10-security/data-security.md`).

## Escalation
SEV-1 unresolved after 30 minutes escalates to the Engineering Lead directly if not already engaged.

## Recovery Verification
Re-run the smoke test from `docs/12-devops/release-process.md` and confirm metrics have returned to baseline before declaring resolved.

## Post-Incident Review
A brief written summary (cause, impact, fix, follow-up actions) is added to `docs/18-changelog/` for any SEV-1/SEV-2 incident; recurring root causes may produce a new ADR or runbook.
