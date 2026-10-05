# v5.6 Upgrade Notes — Workspace Layout & Root Hygiene

## Summary

Version 5.6 reorganizes the repository root so project knowledge, implementation source, reusable starter-kit assets, tooling, and generated/runtime state have clear boundaries.

The upgrade is intentionally structural: it keeps the document-first operating model and the v5.5 runtime/governance capabilities while reducing root-level clutter and centralizing workspace paths.

## Canonical root layout

```text
project-root/
├── README.md
├── START_HERE.md
├── PROJECT_BLUEPRINT.md
├── project.profile.json
├── starter-kit.json
├── docs/
├── apps/
├── packages/
├── infra/
├── tests/
├── kit/
├── tools/
├── .project-docs/
└── .github/
```

## Folder migrations

| v5.5a | v5.6 |
|---|---|
| `registry/` | `kit/registry/` |
| `standards/` | `kit/standards/` |
| `prompts/` | `kit/prompts/` |
| `templates/` | `kit/templates/` |
| `workflows/` | `kit/workflows/` |
| `source-bases/` | `kit/source-bases/` |
| `reusable-modules/` | `kit/reuse/capabilities/` |
| `reusable-patterns/` | `kit/reuse/patterns/` |
| `reusable-templates/` | `kit/reuse/templates/` |
| `PROJECT_PROFILE.example.json` | `kit/examples/project-profile.example.json` |
| `site/` | `.project-docs/site/` |

## Centralized workspace layout

`starter-kit.json` now declares `workspaceLayout` and `workspaceLayoutVersion` as the canonical path map. Tooling resolves logical workspace locations through shared helpers rather than depending on duplicated hard-coded root paths.

Backward-compatible `legacyLayoutAliases` describe the previous v5.5a locations for migration and compatibility handling.

## New layout tooling

From `tools/`:

```bash
npm run layout:check
npm run layout:migrate
```

- `layout:check` validates the canonical v5.6 folder layout, root-entry hygiene, required configured paths, and absence of obsolete root folders.
- `layout:migrate` previews migration from recognized legacy paths; use the tool's explicit apply option when performing an actual migration.

`npm run qa` now includes the workspace-layout check before the remaining registry, profile, pack, source, docs, knowledge, doctor, static-site, and E2E validations.

## Generated site relocation

The static documentation site is now generated under `.project-docs/site/`. It is derived output, not canonical project knowledge, so it no longer competes visually with `docs/`, `apps/`, `packages/`, and other first-class project folders at repository root.

The docs builder was adjusted for the extra directory depth and excludes `docs/_generated` from being rendered as canonical source pages, preventing duplicate/generated navigation paths.

## Reuse library organization

Reusable assets now have one clear home:

```text
kit/reuse/
├── capabilities/
├── patterns/
└── templates/
```

This replaces three separate root-level `reusable-*` folders and better reflects the reusable capability-pack strategy.

## Compatibility notes

- Project documents remain under `docs/`.
- Implementation roots remain `apps/`, `packages/`, `infra/`, and `tests/` for familiar monorepo/developer ergonomics.
- Executable tooling remains under root-level `tools/`.
- Runtime/governance state remains under `.project-docs/`.
- Existing v5.5 document-first governance, WorkPlan, change-management, source-intelligence, progressive-spec, and reusable-pack behavior is retained.

## Recommended migration sequence for existing copies

1. Commit or back up the current repository.
2. Preview the migration with `npm run layout:migrate` from `tools/`.
3. Apply the migration using the tool's apply mode.
4. Review custom scripts/CI files that may reference old paths outside the managed toolset.
5. Run `npm run qa`.
6. Regenerate documentation outputs if needed.
7. Commit the structural migration as one dedicated change.
