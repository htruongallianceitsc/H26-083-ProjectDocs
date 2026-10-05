# v5.5 QA Report

## Scope

This report covers regression and functional verification for:

- entity UID/revision migration behavior;
- lifecycle transition enforcement;
- semantic relation registry validation;
- source scan and source-to-entity evidence;
- Git working-tree impact propagation into the project graph;
- local search/query/context indexes;
- Doctor stale-index detection and safe repair;
- all existing v5.0-v5.4 documentation-first governance flows.

## Automated checks

Final verification is executed with:

```bash
cd tools
npm run qa
```

Expected release criteria:

- registry check: 0 errors;
- Source Base validation: 0 errors;
- documentation validation: 0 errors;
- Doctor: 0 errors on clean workspace;
- static site link check: 0 broken links;
- E2E regression: PASS.

## E2E coverage added in v5.5

The E2E fixture verifies that:

1. legacy entities can receive permanent UIDs through dry-run/apply backfill;
2. invalid lifecycle jumps are rejected and valid transitions are applied;
3. source files can map to Feature/API/Application entities with inspectable evidence;
4. search and boolean query return expected project entities;
5. context packs include graph neighbors plus source evidence;
6. a Git working-tree change maps to direct entities and graph-based potential impact;
7. Doctor detects a stale source index after a source edit and `--fix` rebuilds derived state;
8. prior Request/Ready/WorkPlan/Task, freshness, Progressive Spec, ChangeSet, Baseline and negative relation tests continue to pass.

## Result

Release status: PASS after `npm run qa` completes without errors.

## Final release run

Final `npm run qa` result for the packaged v5.5 starter:

- Registry: 0 errors; 32 entity types; 47 relation rules; 9 quality rules.
- Applicable core standards: 23.
- Reuse packs: 2 validated; 0 errors.
- Source Bases: 6 bases / 12 variants; 0 errors.
- Starter source workspace: PASS.
- Documentation validation: 0 errors / 0 warnings.
- Local knowledge indexes: clean rebuild.
- Doctor: 0 errors / 0 warnings on the clean starter workspace.
- Documentation sync: 294 Markdown files.
- Static site: 294 document pages; 0 broken links.
- E2E regression: PASS including all new v5.5 capabilities and prior governance flows.
