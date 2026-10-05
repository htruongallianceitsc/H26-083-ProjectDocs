# START HERE — v5.3

## 1. Configure the project and documentation depth

Fill `project.profile.json` from `PROJECT_PROFILE.example.json`.

Recommended starting point:

```json
{
  "documentation": {
    "defaultSpecLevel": "standard",
    "targetMaturity": "production",
    "riskEscalation": "warn"
  }
}
```

For a mock/POC project, use `lightweight` + `prototype`. For mixed projects, keep a project default and override individual Features.

## 2. Choose depth before generating detailed docs

```bash
cd tools
npm run spec:status
npm run spec:recommend -- --feature FEAT-...
```

Use:

- Lightweight — low-risk mock/POC/prototype.
- Standard — normal product delivery.
- Full — sensitive/high-impact production work.
- Auto — tooling recommends effective depth from maturity and risk.

## 3. Lightweight still means documented

Use `templates/lightweight-feature-template.md`. Capture Goal, Actors, Main Flow, Key Rules, Acceptance and known impact. Do not create Requirement/Test/API/DB documents merely to fill folders.

## 4. Build documentation before tasks

```text
Idea → Discovery → Scope → Blueprint → Reuse decision
→ Select Spec Level
→ Canonical Feature documentation at current depth
→ Freshness / Mode-aware Ready Gate → WorkPlan → Tasks
→ Implementation → Documentation reconciliation
→ Done Gate → ChangeSet / Baseline
```

## 5. Validate the selected depth

```bash
npm run spec:check -- --feature FEAT-...
npm run gate:ready -- --feature FEAT-...
```

## 6. Promote only when needed

Before UAT/production hardening or when risk increases:

```bash
npm run spec:promote -- --feature FEAT-... --to standard
```

The command creates a gap report under `.project-docs/spec-promotions/` and does not invent missing behaviour. After gaps are resolved:

```bash
npm run spec:promote -- --feature FEAT-... --to standard --apply
```

## 7. Continue v5.1 governance

Before significant edits, run impact analysis. Reconcile important Feature docs for freshness tracking. Capture durable Requests, use reviewed WorkPlans, reconcile after implementation, and record ChangeSets/Baselines at meaningful boundaries.

## 8. Run full QA

```bash
npm run qa
```

QA covers registry drift, spec profile compliance, mode-aware gates, reuse, traceability, freshness, impact, change history and the static documentation site.

## 9. Keep root as an entry surface

Historical upgrade notes, QA reports and transition records belong in `docs/history/`. Do not create future `V*_UPGRADE_NOTES.md` or `V*_QA_REPORT.md` files at repository root.

`npm run docs:validate` enforces the configured history patterns and reports `ROOT_HISTORY_DOC` if such files reappear at root.
