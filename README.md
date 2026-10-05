# Production Project Documentation Starter Kit v5.2

Documentation-first starter kit for long-lived Web, Mobile and API projects, with progressive documentation depth for prototypes through production.

## Core model

```text
Idea / Request
      ↓
Select Spec Level (Lightweight / Standard / Full / Auto)
      ↓
Project-local canonical documentation
      ↓
Typed traceability + impact analysis
      ↓
Dependency freshness review
      ↓
Mode-aware Ready Gate
      ↓
Reviewed WorkPlan
      ↓
Implementation Tasks
      ↓
Documentation reconciliation
      ↓
Mode-aware Done Gate
      ↓
Semantic ChangeSet / Baseline
```

## What v5.2 adds

v5.2 introduces **Progressive Specification** so mock/POC/prototype work does not need production-level documentation on day one:

- project default `documentation.defaultSpecLevel`;
- Feature-level `spec_level` override;
- `target_maturity`: concept / prototype / UAT / production;
- `lightweight`, `standard`, `full`, and `auto` selection;
- policy-driven `registry/spec-profiles.json`;
- Lightweight Feature template with minimum viable documentation;
- mode-aware Ready/Done gates;
- risk/maturity recommendation and configurable escalation (`warn|block|off`);
- `spec:status`, `spec:check`, `spec:recommend`, `spec:promote`;
- promotion gap reports without inventing missing requirements;
- WorkPlans snapshot effective spec level and maturity;
- static Spec Levels dashboard;
- E2E regression for Lightweight → Standard promotion and risk escalation.

v5.2 keeps all v5.1 freshness, impact, ChangeSet and Baseline governance.

## Start

1. Read `START_HERE.md`.
2. Configure `project.profile.json`.
3. Choose the default documentation depth intentionally.
4. Run `cd tools && npm ci && npm run qa`.
5. Build documentation at the current maturity instead of maximizing detail by default.
6. Promote a Feature only when its delivery maturity/risk requires deeper specification.

## Sources of truth

- Project/domain truth: project-local Markdown under `docs/`.
- Machine-readable policy: canonical JSON under `registry/`.
- Spec promotion reports: `.project-docs/spec-promotions/`.
- WorkPlan state: `.project-docs/workplans/`.
- Freshness review state: `.project-docs/freshness/`.
- Semantic history: `.project-docs/changesets/` and `.project-docs/audit-state.json`.
- Named snapshots: `.project-docs/baselines/`.
- Reuse state: `.project-docs/packs.lock.json`, snapshots and proposals.
- Generated site/reports: derived and rebuildable.

## Key v5.2 commands

```bash
cd tools

npm run spec:status
npm run spec:recommend -- --feature FEAT-DASHBOARD
npm run spec:check -- --feature FEAT-DASHBOARD
npm run spec:promote -- --feature FEAT-DASHBOARD --to standard

npm run impact -- --entity REQ-AUTH-001
npm run doc:check -- --entity FEAT-AUTH-LOGIN
npm run doc:reconcile -- --entity FEAT-AUTH-LOGIN --reviewer "Reviewer"

npm run gate:ready -- --feature FEAT-AUTH-LOGIN
npm run plan:scaffold -- --feature FEAT-AUTH-LOGIN
npm run plan:author-complete -- --id WP-... --actor "Author"
npm run plan:submit -- --id WP-...
npm run plan:approve -- --id WP-... --reviewer "Reviewer"
npm run plan:materialize -- --id WP-... --owner "Engineering"
npm run gate:done -- --feature FEAT-AUTH-LOGIN

npm run qa
```

See `V5_2_UPGRADE_NOTES.md`, `V5_2_QA_REPORT.md`, `standards/progressive-specification.md`, and `workflows/16-progressive-specification.md`.
