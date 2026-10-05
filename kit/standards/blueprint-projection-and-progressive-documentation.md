# Blueprint Projection & Progressive Documentation Standard

## Purpose

Use `PROJECT_BLUEPRINT.md` as the single hierarchical entry point for project knowledge without turning it into a competing copy of every canonical document.

## Ownership model

Every Blueprint item has exactly one ownership state:

- `inline` — the Blueprint seed is canonical while the item is still lightweight and has not been promoted.
- `linked` — a canonical Markdown entity under `docs/` owns the detail; the Blueprint only projects a summary/reference.
- `generated` — derived output such as profile/audience renders; never edit manually.

Do not maintain the same detailed truth in both an inline Blueprint block and a linked document.

## Progressive workflow

1. Start with one `PROJECT_BLUEPRINT.md` and record Modules/Features and, when useful, Requirements, Business Rules, Screens, APIs, Database Objects and Test Cases in the seed tables.
2. Run `blueprint:expand -- --profile <level>` to create reviewable candidates. This does not create canonical documents.
3. Review candidates explicitly with `blueprint:review`.
4. Promote accepted candidates with `blueprint:promote`. Promotion changes ownership from `inline` to `linked`.
5. Edit the linked canonical document after promotion; do not keep expanding its inline seed as a second source of truth.
6. Run `blueprint:compile` to refresh the managed projection inside `PROJECT_BLUEPRINT.md`.
7. Run `blueprint:render` to create audience/detail-specific derived Blueprint files.
8. Run `blueprint:diff` / `blueprint:check` to detect stale, missing or conflicting ownership state.
9. Use `blueprint:reconcile -- --prefer linked` after reviewing conflicts where the linked canonical document should win.

## Detail profiles

- `overview` — project/application/module/feature inventory for fast orientation.
- `lightweight` — overview plus key Business Rules and open questions.
- `standard` — Requirements, Screens, Flows, APIs, Test Cases and Decisions.
- `full` — technical/database/NFR/integration/mobile/operations detail and full document bodies.

## Audience profiles

- `general` — everything allowed by the selected detail profile.
- `business` — product intent, requirements, rules, flows and decisions.
- `developer` — implementation-facing API/DB/architecture/source concerns.
- `qa` — requirements, Business Rules, Acceptance Criteria context and verification assets.

Detail and audience are independent dimensions.

## Safety rules

- Candidate promotion requires explicit review.
- Generated Blueprint files are derived and rebuildable.
- Linked canonical documents win during automatic reconciliation.
- A linked Blueprint seed edited after promotion is a conflict, not an automatic overwrite request.
- `PROJECT_BLUEPRINT.md` contains a managed projection block; tooling only rewrites that block and preserves the human-authored seed sections outside it.
