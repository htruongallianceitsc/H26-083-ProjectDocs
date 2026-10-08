# v5.18 Upgrade Notes - Repository Hygiene & Deterministic Build

## Objective

Reduce Git noise and make the documentation toolchain safe to run repeatedly in local development and CI without rewriting tracked generated files solely because the clock changed.

## Changes

### Deterministic generated JSON

`tools/lib/common.mjs` and the legacy async helper in `tools/scripts/lib/core.mjs` now treat top-level `generatedAt` as non-semantic metadata. When the payload excluding `generatedAt` is unchanged, the existing file is preserved. Exact same JSON writes are also skipped.

Expected invariant:

```text
npm run qa
npm run qa
```

The second run must produce no tracked-file diff when canonical inputs did not change.

### Generated artifact policy

Added `kit/standards/generated-artifacts-policy.md`.

Disposable outputs are ignored at repository root: static site, local indexes, reports, bundle export/import folders and caches. Deterministic review projections such as `docs/_generated/` may remain tracked because they help review, but they are never canonical.

### Root repository hygiene

Added root `.gitignore` and `.editorconfig`. Removed the accidental root `package-lock.json`; npm tooling remains isolated under `tools/` with `tools/package-lock.json`.

`repository-entry-hygiene.md` now distinguishes the canonical documentation entry surface from non-documentation repository metadata. `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md` and `.github/CODEOWNERS` remain optional because their correct content depends on repository ownership/distribution policy.

### README responsibility

The root README is now a short landing page focused on purpose, v5.18 highlights, quick start, core model and entry links. Historical release detail remains under `docs/history/`.

`START_HERE.md` remains the operational workflow and `PROJECT_BLUEPRINT.md` remains the progressive project specification; they are intentionally not merged.

### Version-safe static site

The static site header now reads the starter version from `starter-kit.json` instead of hard-coding `Project Docs v5.15`.

## Upgrade notes for existing projects

1. Copy/merge the new root `.gitignore` and `.editorconfig`.
2. Remove any accidental root `package-lock.json` if npm tooling belongs only under `tools/`.
3. Stop tracking disposable `.project-docs/site/`, `.project-docs/indexes/` and `.project-docs/reports/` files in Git; CI/local QA will recreate them.
4. Keep deterministic review projections only when they add review value.
5. Run `cd tools && npm ci && npm run qa` twice and verify the second run leaves no tracked diff.
