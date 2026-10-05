---
code: NFR-BACKUP-001
type: nfr
title: Database Backup and Recovery
status: draft
owner: Engineering Lead
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [backup, database]
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
Reliability / Backup

## Requirement
Production data must be recoverable after a database failure or accidental corruption with a bounded, acceptable data-loss window.

## Metric
Recovery Point Objective (RPO) and Recovery Time Objective (RTO).

## Target
RPO: 1 hour (continuous WAL archiving between daily full snapshots, per `docs/08-database/database-overview.md`). RTO: 4 hours for a full restore.

## Measurement Method
Periodic restore drill (see `docs/13-operations/monitoring.md` for scheduling once established).

## Scope
The production PostgreSQL instance.

## Failure Threshold
Any restore drill exceeding the RTO target or revealing data loss beyond the RPO target requires a follow-up remediation plan.

## Verification / Test
Restore drill, performed at least before the first production release and periodically thereafter.
