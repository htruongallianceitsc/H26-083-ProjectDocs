# v5.8 QA Report

## Scope

Regression validation for the v5.7 → v5.8 Acceptance & Verification Traceability upgrade.

## Automated QA coverage

`npm run qa` validates:

- workspace layout and root hygiene;
- registry consistency and generated registry mirrors;
- reusable packs and Source Bases;
- source workspace/source intelligence;
- Progressive Specification;
- Acceptance Criteria and Business Rule verification coverage;
- document validation;
- local knowledge indexes and Doctor;
- freshness/governance;
- generated static site and internal links;
- full E2E regression including v5.7 brownfield behavior.

## v5.8 E2E assertions

The E2E fixture verifies:

1. an approved Requirement with stable `AC-01` passes verification when a Test Case maps `REQ-DEMO-001#AC-01`;
2. changing the mapping to nonexistent `AC-99` fails with `invalid-acceptance-reference`;
3. an approved critical Business Rule passes only when positive and negative case refs both exist;
4. replacing the negative case with a second positive case fails `critical-business-rule-verification`;
5. normal Requirement/Test graph links remain compatible with exact AC refs;
6. Ready/Done, WorkPlan, freshness, brownfield, source intelligence, ChangeSet/Baseline, and broken-relation regressions continue to pass.

## Final result

Final automated run: **PASS**

- Workspace layout: 0 errors, 0 warnings.
- Registry: 0 errors; 32 entity types, 50 relation rules, 11 quality rules.
- Applicable core standards in generic starter profile: 25.
- Source Bases: 0 errors; 6 bases, 12 variants.
- Verification check: 0 errors, 0 warnings in the generic starter workspace.
- Documentation validation: 0 errors, 0 warnings.
- Static site: 310 Markdown document pages after v5.8 release notes are included.
- Verification page: generated successfully.
- Site link check: 0 broken links.
- E2E regression: PASS.
