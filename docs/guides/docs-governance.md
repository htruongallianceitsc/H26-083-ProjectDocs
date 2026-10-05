# Documentation Governance v5.8

## Principle

Documentation depth must be proportional to delivery maturity and risk. The project must remain traceable without forcing every prototype to pay the cost of production-level decomposition immediately.

## Canonical layers

1. `docs/` — product/project truth.
2. `kit/registry/*.json` — machine-readable schema/policy truth.
3. `.project-docs/spec-promotions/` — promotion gap evidence; not domain truth.
4. `.project-docs/workplans/` — reviewed implementation planning state.
5. `.project-docs/freshness/` — dependency review snapshots.
6. `.project-docs/changesets/` + `audit-state.json` — semantic change history.
7. `.project-docs/baselines/` — named milestone fingerprints.
8. `.project-docs/packs.*` — reusable-pack governance.
9. `docs/_generated/` and `.project-docs/site/` — derived views only.

## Progressive specification

`kit/registry/spec-profiles.json` defines Lightweight, Standard and Full documentation expectations. `auto` is a selection mode resolved from maturity and risk.

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

Repository root is an entry surface, not a version archive or general documentation dumping ground. Version upgrade notes, QA reports and historical migration/review notes belong in `docs/history/`. General guides and standards belong in `docs/guides/` or `kit/standards/`.

`starter-kit.json.documentationLayout` defines the canonical history directory and root-history filename patterns. `docs:validate` blocks matching historical or misplaced files at root.


## v5.4 Source Workspace Governance

1. Documentation and source may live in the same project workspace.
2. `application` entities are the canonical deployable-boundary records.
3. Feature-to-source ownership uses typed `related.applications` relations.
4. `.project-docs/source.lock.json` stores provenance, not business truth.
5. Source Bases are copied once; project source becomes canonical after materialization.
6. Existing code is adopted in place with `source:adopt`; source movement is not required.
7. Source Base upgrades must be reviewed migrations and must not overwrite project source automatically.
8. v6 source/Git intelligence should build on Application boundaries rather than inventing source ownership from filenames.

## v5.5 Knowledge Runtime Governance

1. Every new typed entity receives a permanent UUID `uid`; `code` remains the human-readable project reference.
2. Governed status changes must follow lifecycle transitions from `kit/registry/entity-types.json`.
3. Exact typed relation rules take precedence over wildcard compatibility rules. Fallback use is reviewable evidence, not an ideal steady state.
4. Source indexes and knowledge indexes are derived caches. They can never replace canonical Markdown entities or real source files.
5. Source-to-entity matches based on code/technical identifier scanning are evidence only; they do not create durable graph relations automatically.
6. Git impact is potential impact based on current mapping evidence and graph rules. Human review remains required for implementation/release decisions.
7. AI agents should prefer bounded `context` packs over unbounded repository scans.
8. `doctor --fix` is limited to safe derived-state repair and must not silently change business meaning.

## v5.6 Workspace Layout Governance

1. Project/domain truth remains under `docs/`.
2. Reusable framework assets live under the visible `kit/` root.
3. Executable tooling stays first-class under `tools/`.
4. Implementation roots (`apps/`, `packages/`, `tests/`, `infra/`) remain at repository root for developer/CI ergonomics.
5. Generated/runtime state belongs under `.project-docs/`; `.project-docs/site/` is rebuildable.
6. Canonical physical paths come from `starter-kit.json.workspaceLayout`. New tooling must use the shared resolver instead of adding root-path literals.
7. v5.5 root names are compatibility aliases for migration only and must not be recreated in a healthy v5.6 workspace.

## v5.7 Brownfield Governance

Existing source enters the knowledge model through a controlled evidence lifecycle:

1. `source:adopt` registers the Application boundary and marks adoption `brownfield / in-progress`.
2. `brownfield:inventory` and `brownfield:candidates` create derived evidence under `.project-docs/brownfield/`.
3. Candidates remain non-canonical until explicitly reviewed.
4. `brownfield:promote` may create canonical docs only for accepted candidates.
5. `brownfield:reconcile` detects unresolved review/promotion/evidence gaps.
6. `gate:baseline` must pass before `brownfield:baseline` creates the accepted initial baseline.
7. Physical source normalization is proposal-only until represented by a reviewed WorkPlan.

This is intentionally separate from the normal Ready Gate: Ready asks whether planned work is ready to implement; Brownfield Baseline asks whether already-existing implementation has been sufficiently understood and reconciled to enter normal docs-first governance.


## v5.8 Acceptance & Verification Governance

Acceptance Criteria use stable Requirement-local IDs and are verified by exact Test Case references. Critical Business Rules require positive/negative evidence according to registry policy. Generated verification reports are derived; Requirement, Business Rule, and Test Case docs remain canonical.
