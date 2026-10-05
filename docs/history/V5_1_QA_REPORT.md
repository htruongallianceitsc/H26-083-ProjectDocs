# v5.1 QA Report

## Result

**PASS**

Full command:

```bash
cd tools
npm run qa
```

## Starter workspace results

- Registry: **0 errors**
- Entity types: **31**
- Relation rules: **36**
- Quality rules: **9**
- Applicable core standards: **16**
- Reusable packs: **2 / 2 valid**
- Documentation validation: **0 errors / 0 warnings**
- Static site broken links: **0**
- Starter project domain entities: **0** by design

## v5.1 E2E regression

The isolated fixture validates a real typed graph and the complete governance path.

Covered cases:

1. baseline fixture graph validation;
2. Feature freshness reconciliation;
3. dependency content change → `STALE`;
4. stale documentation blocks Ready;
5. restored dependency returns to `FRESH`;
6. Requirement impact analysis surfaces linked Feature as HIGH impact;
7. audit-state initialization;
8. Request creation and promotion;
9. promoted Request invalidates Feature freshness;
10. reconciliation restores Ready;
11. WorkPlan author/submit lifecycle;
12. post-submit documentation change rejects approval with `STALE_CONTEXT`;
13. approved WorkPlan materializes implementation Tasks;
14. semantic ChangeSet detects Request/WorkPlan/Task changes;
15. named Baseline captures pre-completion state;
16. Feature/Test/Task completion makes tracked Feature stale;
17. stale documentation blocks Done until reconciliation;
18. Baseline comparison detects implementation drift;
19. post-implementation reconciliation allows Done;
20. second ChangeSet captures completion/reconciliation batch;
21. generated Governance output contains freshness, ChangeSets and Baselines;
22. broken relation negative path is still rejected.

Final regression message:

```text
E2E regression: PASS (dependency freshness + Ready/Done freshness gates + Request/WorkPlan/Task flow + stale WorkPlan protection + graph impact + semantic ChangeSets + baseline drift + broken relation path).
```

## Packaging acceptance criteria

Before delivery the ZIP must be unpacked into a clean directory and pass:

```bash
cd tools
npm ci
npm run qa
```
