# Implementation Governance Standard — v5.3

## Purpose

Bridge documentation to implementation while allowing proportional documentation depth.

```text
Request
  -> Canonical Documentation at selected Spec Level
  -> Mode-aware Ready Gate
  -> WorkPlan
  -> Review / Approval
  -> Tasks
  -> Implementation
  -> Documentation reconciliation
  -> Mode-aware Done Gate
```

## Progressive specification rule

WorkPlan/Task generation must use the Feature's effective `spec_level`. A Lightweight WorkPlan is acceptable for a suitable prototype, but it must carry that depth/maturity explicitly so downstream users do not mistake prototype evidence for production completeness.

When the selected level is below risk/maturity recommendation, tooling follows `project.profile.json.documentation.riskEscalation`.

## Request rules

- Capture durable requests when provenance, prioritization, or change history matters.
- A Request describes why/what is being asked; it does not replace canonical product documentation.

## Ready Gate

A WorkPlan cannot be submitted unless the target Feature passes `kit/registry/readiness-rules.json` plus the effective profile from `kit/registry/spec-profiles.json`.

The gate is registry-driven. Do not hard-code Standard requirements into prompts or assume every Feature requires separate Requirement/Test entities.

## WorkPlan rules

- WorkPlans live in `.project-docs/workplans/`; they are governance artifacts, not product/domain entities.
- New scaffolds use WorkPlan schema 1.1 and snapshot effective/requested spec level, target maturity, recommendation and risk matches.
- Scaffolded plans have `requiresAuthoring=true` and must be refined before submission.
- Submission captures a hash of the Feature and direct documentation context.
- Approval/materialization fail on `STALE_CONTEXT`.

## Task rules

- Tasks are created only after an approved WorkPlan unless an explicit exception exists.
- Tasks link back to canonical context and do not compensate for missing product knowledge by inventing behaviour.

## Done Gate

Done is mode-aware and freshness-aware. It confirms implementation/task completion without falsely upgrading documentation maturity.

## Promotion rule

If a Feature moves from prototype to UAT/production, run `spec:promote`. Resolve target-level gaps in canonical docs first; then apply the promoted level and create/re-author WorkPlans against the new context.

## Maintenance governance

Continue v5.1 impact, freshness, ChangeSet and Baseline rules for all spec levels.
