# Documentation Governance v5.4

## Principle

Documentation depth must be proportional to delivery maturity and risk. The project must remain traceable without forcing every prototype to pay the cost of production-level decomposition immediately.

## Canonical layers

1. `docs/` — product/project truth.
2. `registry/*.json` — machine-readable schema/policy truth.
3. `.project-docs/spec-promotions/` — promotion gap evidence; not domain truth.
4. `.project-docs/workplans/` — reviewed implementation planning state.
5. `.project-docs/freshness/` — dependency review snapshots.
6. `.project-docs/changesets/` + `audit-state.json` — semantic change history.
7. `.project-docs/baselines/` — named milestone fingerprints.
8. `.project-docs/packs.*` — reusable-pack governance.
9. `docs/_generated/` and `site/` — derived views only.

## Progressive specification

`registry/spec-profiles.json` defines Lightweight, Standard and Full documentation expectations. `auto` is a selection mode resolved from maturity and risk.

Resolution order: Feature override → project default → registry default.

Lightweight is a valid completion state for suitable prototype work; it is not synonymous with Draft. The same Feature code is retained when promoted.

## Risk escalation

Risk/maturity recommendation is visible in `spec:status` and WorkPlans. Explicit low depth below recommendation is warned by default and can be configured to block through `project.profile.json.documentation.riskEscalation`.

## Mode-aware gates

Ready/Done uses the effective Feature spec profile. Standard keeps explicit Requirement/Test traceability. Lightweight uses minimum viable Feature sections instead of manufacturing separate entities. Full adds stronger NFR/failure/security depth.

## Promotion

`spec:promote` generates a gap report. It never creates product facts to satisfy gates. Resolve gaps from confirmed knowledge, then apply the target level.

## Freshness, impact and history

All v5.1 rules remain: use typed impact before material changes, reconcile tracked Feature documentation after dependency changes, protect WorkPlan review with context hashes, and capture meaningful semantic batches with ChangeSets/Baselines.

## No-bypass rule

Do not weaken spec, freshness, Ready/Done, WorkPlan or reuse policies just to clear a gate. Change depth only because project maturity/risk changed or because the team explicitly accepted the trade-off.

## Repository entry hygiene

Repository root is an entry surface, not a version archive. Version upgrade notes, QA reports and historical migration/review notes belong in `docs/history/`. Current reference documents may remain at root even when their filenames contain an older version marker if they are still active guidance.

`starter-kit.json.documentationLayout` defines the canonical history directory and root-history filename patterns. `docs:validate` blocks matching historical files at root.


## v5.4 Source Workspace Governance

1. Documentation and source may live in the same project workspace.
2. `application` entities are the canonical deployable-boundary records.
3. Feature-to-source ownership uses typed `related.applications` relations.
4. `.project-docs/source.lock.json` stores provenance, not business truth.
5. Source Bases are copied once; project source becomes canonical after materialization.
6. Existing code is adopted in place with `source:adopt`; source movement is not required.
7. Source Base upgrades must be reviewed migrations and must not overwrite project source automatically.
8. v6 source/Git intelligence should build on Application boundaries rather than inventing source ownership from filenames.
