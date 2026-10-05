# v5.6 QA Report

## Scope

Regression validation for the v5.5a → v5.6 workspace-layout migration.

## Command

```bash
cd tools
npm run qa
```

## Result

**PASS**

The full QA pipeline completed successfully after the structural migration.

## Validation summary

| Check | Result |
|---|---|
| Workspace layout | PASS — 0 errors, 0 warnings |
| Registry | PASS — 32 entity types, 47 relation rules, 9 quality rules |
| Project profile / standards | PASS — 23 core standards resolved from `kit/standards/` |
| Reusable packs | PASS — AUTH capability and common CRUD pattern validated |
| Source bases | PASS — 6 bases, 12 variants |
| Source workspace | PASS |
| Source intelligence scan | PASS |
| Documentation validation | PASS — 0 errors, 0 warnings |
| Knowledge reindex | PASS |
| Workspace doctor | PASS — 0 errors, 0 warnings |
| Documentation sync | PASS |
| Static documentation build | PASS |
| Static-site link validation | PASS — 0 broken links |
| End-to-end regression | PASS |

## E2E coverage retained

The E2E regression confirms v5.6 layout changes did not break the existing v5.5 capabilities, including:

- entity identity and lifecycle;
- semantic relations;
- source bases and source intelligence;
- Git impact analysis;
- search/query/context/doctor;
- Progressive Specs;
- governance and document freshness;
- ChangeSets/Baselines;
- broken-relation diagnostics.

## Migration-specific checks

- Canonical `kit/` hierarchy exists.
- Legacy root folders are absent.
- Generated site uses `.project-docs/site/`.
- `workspaceLayout` is centrally declared in `starter-kit.json`.
- Tooling resolves canonical layout paths through shared helpers.
- CI/documentation references use the new canonical paths.
- Repository root complies with the v5.6 root-hygiene model.
