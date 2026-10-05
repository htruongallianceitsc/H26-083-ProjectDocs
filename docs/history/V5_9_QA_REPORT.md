# v5.9 QA Report

## Scope

Regression validation for the v5.8 → v5.9 Blueprint Projection & Progressive Documentation upgrade.

## Automated QA coverage

`npm run qa` validates:

- workspace layout/root hygiene;
- registry consistency and generated mirrors;
- reusable packs and Source Bases;
- source workspace and source intelligence;
- Progressive Specification;
- Acceptance/Verification traceability;
- Blueprint ownership/conflict check;
- document validation;
- local knowledge indexes and Doctor;
- freshness/governance;
- generated static site and links;
- legacy full E2E regression;
- dedicated Blueprint round-trip E2E regression.

## v5.9 Blueprint E2E assertions

The dedicated fixture verifies:

1. one `PROJECT_BLUEPRINT.md` creates candidates for Module, Feature, Requirement and Test Case seed rows;
2. promotion is blocked behind explicit accepted reviews;
3. accepted candidates are promoted to canonical Markdown under the expected folders;
4. post-promotion relation rebuilding connects Module→Feature and Feature→Requirement/Test correctly;
5. `blueprint:compile` produces the managed docs→Blueprint projection without rewriting human seed sections;
6. `blueprint:render` produces a standalone profile/audience projection;
7. editing only the canonical document produces `stale`;
8. editing both canonical document and old seed produces `conflict`;
9. `blueprint:reconcile -- --prefer linked` clears the reviewed conflict in favor of canonical docs;
10. older E2E workspaces without `PROJECT_BLUEPRINT.md` remain compatible.

## Final result

Final automated run: **PASS**

- Workspace layout: 0 errors, 0 warnings.
- Registry: 0 errors; 32 entity types, 55 relation rules, 11 quality rules.
- Applicable core standards in generic starter profile: 26.
- Source Bases: 0 errors; 6 bases, 12 variants.
- Verification check: 0 errors, 0 warnings.
- Blueprint check: 0 stale items, 0 conflicts, 0 missing linked documents in the starter workspace.
- Documentation validation: 0 errors, 0 warnings.
- Static site: 317 Markdown document pages after this QA report is included.
- Blueprint page: generated successfully.
- Site link check: 0 broken links.
- Legacy E2E regression: PASS.
- Blueprint round-trip E2E regression: PASS.
