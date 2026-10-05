# Production Project Documentation Starter Kit v5.3

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

## What v5.3 changes

v5.3 is a repository-entry cleanup release. Historical upgrade and QA records no longer compete with the documents people should open first.

- `docs/history/` is now the canonical home for version upgrade notes, QA reports and historical upgrade/migration reviews.
- Prior `V3_*`, `V4_*`, `V5_*` upgrade/QA records were moved there.
- `REVIEW_UPGRADE_NOTES.md` was moved there as historical transition material.
- Current reference material such as `REUSE_STRATEGY_V4.md` stays at root when it is still an active strategy document; classification is based on purpose, not just a version-looking filename.
- `standards/repository-entry-hygiene.md` defines the root/history rule.
- `starter-kit.json.documentationLayout` carries machine-readable history placement policy.
- `docs:validate` now fails with `ROOT_HISTORY_DOC` if historical release/upgrade files matching configured patterns return to root.
- E2E regression covers the negative root-history case.

## Progressive Specification inherited from v5.2

The v5.2 Lightweight/Standard/Full/Auto model remains unchanged:

- project default `documentation.defaultSpecLevel`;
- Feature-level `spec_level` override;
- `target_maturity`: concept / prototype / UAT / production;
- policy-driven `registry/spec-profiles.json`;
- Lightweight Feature template with minimum viable documentation;
- mode-aware Ready/Done gates;
- risk/maturity recommendation and configurable escalation (`warn|block|off`);
- `spec:status`, `spec:check`, `spec:recommend`, `spec:promote`;
- promotion gap reports without inventing missing requirements;
- WorkPlans snapshot effective spec level and maturity.

v5.3 also keeps all v5.1 freshness, impact, ChangeSet and Baseline governance.

## Start

1. Read `START_HERE.md`.
2. Configure `project.profile.json`.
3. Choose the default documentation depth intentionally.
4. Run `cd tools && npm ci && npm run qa`.
5. Build documentation at the current maturity instead of maximizing detail by default.
6. Promote a Feature only when its delivery maturity/risk requires deeper specification.
7. Put future version upgrade/QA records directly under `docs/history/`, never at root.

## Sources of truth

- Project/domain truth: project-local Markdown under `docs/`.
- Historical release/upgrade records: `docs/history/`.
- Machine-readable policy: canonical JSON under `registry/` plus layout policy in `starter-kit.json`.
- Spec promotion reports: `.project-docs/spec-promotions/`.
- WorkPlan state: `.project-docs/workplans/`.
- Freshness review state: `.project-docs/freshness/`.
- Semantic history: `.project-docs/changesets/` and `.project-docs/audit-state.json`.
- Named snapshots: `.project-docs/baselines/`.
- Reuse state: `.project-docs/packs.lock.json`, snapshots and proposals.
- Generated site/reports: derived and rebuildable.

## Key commands

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

See `docs/history/V5_3_UPGRADE_NOTES.md`, `docs/history/V5_3_QA_REPORT.md`, `docs/history/README.md`, and `standards/repository-entry-hygiene.md` for v5.3 details.
