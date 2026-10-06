# Repository Entry & History Hygiene Standard — v5.12

## Purpose

Keep the repository root strictly minimal as a fast entry surface instead of turning it into a documentation dumping ground or chronological archive.

## Rules

1. Repository root contains only essential entry points:
   - `README.md` (Landing & Overview)
   - `START_HERE.md` (Quickstart & Onboarding Workflow)
   - `PROJECT_BLUEPRINT.md` (Project Inventory Map)
   - `project.profile.json` (Project Profile Config)
   - `starter-kit.json` (Starter Kit Metadata & Policy)
2. Version upgrade notes, QA reports and historical migration/review notes belong in `docs/history/`.
3. General guides, governance documents, catalogs, and architectural references belong in `docs/guides/` or `kit/standards/`.
4. Historical files keep stable filenames unless there is a concrete migration reason to rename them.
5. Strategy documents must use version-agnostic canonical names (e.g. `kit/standards/reuse/reuse-strategy.md` instead of `REUSE_STRATEGY_V4.md`).
6. New version notes and QA reports must be created directly under `docs/history/`.
7. Generated indexes and the static site remain responsible for discoverability after files move.
8. `docs:validate` must fail when a configured historical or non-entry filename pattern appears at repository root.
9. Links to historical records or moved guides must use their `docs/history/...` or `docs/guides/...` paths.

## Canonical Root Entry Surface

The canonical root entry set is strictly:

- `README.md`
- `START_HERE.md`
- `PROJECT_BLUEPRINT.md`
- `project.profile.json`
- `starter-kit.json`

All other documentation and governance artifacts live under `docs/` or `kit/`. The `kit/` root groups registry, standards, prompts, templates, workflows, Source Bases, reuse assets, and examples so framework assets do not dilute the project root. Generated/runtime artifacts live under `.project-docs/`; the static site is `.project-docs/site/`. Project design evidence may live under the governed `mockups/` directory; it must not become an uncontrolled Markdown/documentation dump.
