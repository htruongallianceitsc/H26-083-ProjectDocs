# Workflow 14 — Request to WorkPlan to Task

## Goal

Turn a user/change request into implementation-ready tasks only after canonical documentation is complete and reviewable.

## Flow

```text
1. Capture Request
       ↓
2. Analyze / decide scope
       ↓
3. Create or update canonical docs
       ↓
4. Promote Request to durable entities
       ↓
5. Run validation + Ready Gate
       ↓
6. Scaffold WorkPlan
       ↓
7. Author/review task breakdown, assumptions, risks, acceptance criteria
       ↓
8. Mark authoring complete
       ↓
9. Submit WorkPlan (captures context hash)
       ↓
10. Review + approve
       ↓
11. Materialize Tasks
       ↓
12. Implement
       ↓
13. Reconcile docs/tests
       ↓
14. Run Done Gate
```

## Commands

```bash
cd tools

npm run request:create -- --title "..." --kind change --summary "..."
npm run request:promote -- --request REQST-... --target FEAT-...

npm run docs:validate
npm run gate:ready -- --feature FEAT-...

npm run plan:scaffold -- --feature FEAT-...
# Review/edit .project-docs/workplans/WP-....json
npm run plan:author-complete -- --id WP-... --actor "Author"
npm run plan:submit -- --id WP-...
npm run plan:approve -- --id WP-... --reviewer "Reviewer"
npm run plan:materialize -- --id WP-... --owner "Engineering"

# After implementation/reconciliation:
npm run gate:done -- --feature FEAT-...
```

## Safety properties

- Submit is blocked if the Ready gate fails.
- Approval is blocked when documentation changed after submit.
- Task materialization is blocked when approved context is stale.
- WorkPlan is separate from business truth.
