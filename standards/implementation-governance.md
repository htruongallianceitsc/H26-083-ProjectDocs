# Implementation Governance Standard

## Purpose

V5.0 introduces an explicit bridge from documentation to implementation without allowing Tasks to become a second source of product truth.

```text
Request
  -> Canonical Documentation
  -> Ready Gate
  -> WorkPlan
  -> Review / Approval
  -> Tasks
  -> Implementation
  -> Done Gate
```

## Request rules

- Capture durable requests when provenance, prioritization, or change history matters.
- A Request describes why/what is being asked; it does not replace Feature/Requirement/API/Screen/DB/Test documentation.
- Accepted requests must be promoted to one or more durable target entities.

## Ready Gate

A WorkPlan cannot be submitted unless the target Feature passes the machine-readable Ready gate in `registry/readiness-rules.json`.

The default v5.1 gate verifies at least:

- Feature status permits implementation planning.
- At least one linked Requirement exists.
- At least one linked Test Case exists.
- Linked Requirements are approved/implemented.
- Linked Tests are ready/passed.
- No linked blocking/open Open Question remains.
- Imported packs have approved review state when required.

The gate is intentionally registry-driven so projects can tighten it without rewriting tool logic.

## WorkPlan rules

- WorkPlans live in `.project-docs/workplans/`; they are governance artifacts, not product/domain entities.
- Scaffolded plans have `requiresAuthoring=true` and must be reviewed/refined before submission.
- Submission captures a hash of the Feature and its direct documentation context.
- Approval fails if the documentation context changed after submission (`STALE_CONTEXT`).
- Materialization fails if approved context became stale before task creation.
- WorkPlan review never bypasses entity/relation/quality validation.

## Task rules

- Tasks are created only after an approved WorkPlan, unless a project explicitly documents an exception.
- Every implementation Task must link to at least one Feature.
- Tasks may point to Requirement/Screen/API/DB/Test/Request context but must not duplicate their canonical content.
- Task completion evidence records implementation/test/reconciliation facts, not new product requirements.

## Done Gate

The default Done gate verifies:

- Feature status is `implemented`.
- Linked Feature tests are `passed`.
- All incoming Tasks linked through `related.features` are `done`.
- At least one implementation Task exists.
- No linked blocking/open Open Question remains.

A project can extend the Done gate later with documentation freshness, release, monitoring, or change-set rules.


## v5.1 Maintenance Governance

Before significant canonical edits, run typed graph impact analysis. After dependency changes, run freshness checks and reconcile only after review. Record meaningful reviewed batches as semantic ChangeSets and create named Baselines at UAT/release/migration boundaries.
