# v5.7 QA Report

## Scope

Regression validation for the v5.6 → v5.7 Brownfield Adoption & Reverse Engineering upgrade.

## Automated QA coverage

`npm run qa` validates:

- canonical workspace layout and root hygiene;
- registry consistency, including brownfield policy safety defaults and adapter/source-profile references;
- project profile and applicable standards;
- reusable packs and Source Bases;
- source workspace and source intelligence;
- Progressive Specification and document validation;
- knowledge indexes and Doctor;
- freshness/governance generation;
- static documentation site and internal links;
- full E2E regression.

## Brownfield E2E scenario

The E2E fixture now exercises an existing React project with source under a non-canonical `legacy-web/` root:

1. `source:adopt` registers `APP-LEGACY` and marks brownfield adoption in progress.
2. `brownfield:inventory` inventories existing source.
3. `brownfield:candidates` detects an AUTH Feature plus source artifacts.
4. Candidate review accepts the Feature and rejects non-selected artifacts.
5. `brownfield:promote` creates the reviewed canonical Feature document.
6. `brownfield:reconcile` passes after review/promotion gaps are resolved.
7. `gate:baseline` passes.
8. `brownfield:refactor-plan` produces a proposal and is verified not to move the legacy source.
9. `brownfield:baseline` creates the accepted initial baseline and marks adoption reconciled.
10. Existing v5.5/v5.6 source intelligence, governance, freshness, WorkPlan, ChangeSet, Baseline and broken-relation tests continue to pass.

## Safety assertions

- `candidatePolicy.autoPromote` must remain `false`.
- Candidate promotion is review-gated.
- `normalization.allowDirectMove` must remain `false`.
- Refactor planning is proposal-only and requires a reviewed WorkPlan for execution.
- Brownfield runtime evidence does not replace canonical Markdown entities.

## Final result

Final automated run: **PASS**

- Workspace layout: 0 errors, 0 warnings.
- Registry: 0 errors; 32 entity types, 47 relation rules, 9 quality rules.
- Applicable core standards in generic starter profile: 24.
- Source Bases: 0 errors; 6 bases, 12 variants.
- Documentation validation: 0 errors, 0 warnings.
- Starter workspace source/knowledge state: 0 configured entities and 0 source files, as expected for the generic template.
- Static site: 305 Markdown document pages plus first-class Brownfield runtime page.
- Site link check: 0 broken links.
- E2E regression: PASS.
