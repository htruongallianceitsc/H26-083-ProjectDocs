# v5.14 QA Report

**Version:** 5.14.0  
**Date:** 2026-10-06  
**Result:** PASS

## Scope

v5.14 QA covers registry compatibility, Shared UI entity/relation governance, composition-aware wireframe rendering, shared dependency freshness and all retained regression suites.

## Registry

- `registry:sync`: PASS.
- `registry:check`: PASS — 34 entity types, 58 relation rules, 13 quality rules, 0 errors.
- New entity types: `ui-component`, `screen-shell`.
- New exact relations: Screen → Shell, Screen → UI Component, Shell → UI Component.
- Impact fields `screen_shells` and `ui_components` validate against the relation registry.

## Shared UI Wireframe E2E

Verified:

1. canonical Mobile Header `ui-component`;
2. canonical Bottom Navigation `ui-component`;
3. `UI-SHELL-MOBILE-MAIN` placement of both components;
4. Screen selection through `related.screen_shells`;
5. Header `title` and `rightActions` overrides;
6. Bottom Navigation `activeItem` override;
7. effective Shell + shared + Screen-local visual composition;
8. HTML shared ownership/provenance rendering;
9. generated semantic spec schema `1.3`;
10. shared dependency hash recording;
11. changed shared Header produces blocking `STALE_WIREFRAME_DEPENDENCY`;
12. rebuild clears the stale dependency;
13. existing v5.13 visual/lifecycle behaviour remains compatible.

Wireframe E2E: **PASS**.

## Full regression

`npm run qa`: **PASS**.

Retained regression suites passed for:

- v5.13 visual Screen-first wireframes;
- v5.12 Screen lifecycle/system/API contract and governed promotion;
- v5.10 mockup workflow;
- v5.9 Blueprint projection;
- v5.8 acceptance/verification traceability;
- v5.7 brownfield adoption/reconciliation;
- v5.6 workspace layout;
- v5.5 identity/lifecycle/relations, source intelligence, local knowledge/Doctor;
- Progressive Specification, governance, freshness and ChangeSets/Baselines.

## Documentation/site

- Documentation validation: PASS, 0 errors / 0 warnings.
- Static site build: PASS.
- Static site link check: PASS, 0 broken links.

## Conclusion

v5.14 is backward compatible with v5.13 Screens while adding a canonical Shared UI composition layer suitable for reusable mobile Headers, Bottom Navigation and application shells. Shared changes are graph-impactable and invalidate derived Screen wireframes until rebuilt.
