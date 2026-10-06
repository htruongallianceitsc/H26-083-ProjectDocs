# v5.12 QA Report

**Version:** 5.12.0  
**Focus:** Screen Lifecycle/System/API contracts + authoring-gated wireframe gap promotion

## Scope

QA verifies that v5.12 preserves v5.11 Screen-first behaviour and all earlier workflows while adding lifecycle/system/API projection and safe multi-entity promotion.

## Dedicated Wireframe E2E

The v5.12 Wireframe E2E covers:

1. Login Screen with normal user action.
2. Splash Screen with **zero user actions**.
3. `onEnter` Lifecycle Action calling startup config.
4. System Action for config persistence/evaluation.
5. API Interaction projection.
6. ASCII + semantic spec + combined HTML rendering.
7. Verification that lifecycle-only Splash does not trigger `SCREEN_ACTIONS_TBD`.
8. `startup-flow-gap` creation and acceptance.
9. `startup-bootstrap` promotion draft with `requiresAuthoring=true`.
10. Explicit authored promotion plan.
11. Multi-entity materialization.
12. Stale Screen projection detection after source change.
13. Rebuild and session closure.

## Regression suites

- Core E2E regression: PASS.
- Blueprint E2E: PASS.
- Mockup E2E: PASS.
- Wireframe E2E: PASS.

## Safety / governance assertions

- Generated wireframes remain derived artifacts.
- Promotion requires an accepted gap.
- Promotion draft does not invent exact entity codes/content.
- Apply requires `status=authored` and `requiresAuthoring=false`.
- Existing entity codes are protected from overwrite by default.
- Startup failure/retry/cache semantics remain explicit TBD/Open Questions unless authored.

## Final result

v5.12 extends Screen-first review to automatic lifecycle/system behaviour without weakening Documentation-First ownership. Splash/bootstrap flows can now be reviewed meaningfully, and newly discovered complexity can be promoted into the correct canonical entity set through an explicit authoring gate.

## Full QA run

Final `npm run qa` result:

- Workspace layout: **0 errors / 0 warnings**.
- Registry: **0 errors**; 32 entity types, 55 relation rules, 11 quality rules.
- Verification: **0 errors / 0 warnings**.
- Mockup check: **PASS**.
- Wireframe check: **PASS** (inactive by default; no mandatory adoption).
- Documentation validation: **0 errors / 0 warnings**.
- Doctor: **0 errors / 0 warnings**.
- Static site: **334 document pages**.
- Site link check: **0 broken links**.
- Core regression E2E: **PASS**.
- Blueprint E2E: **PASS**.
- Mockup E2E: **PASS**.
- Wireframe v5.12 E2E: **PASS**.
