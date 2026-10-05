# Documentation Toolchain v4.1

Requires Node.js 20+. No third-party npm runtime dependencies are required.

## Runtime architecture

There is one supported runtime:

```text
tools/scripts/docs-tool.mjs      documentation/profile/site commands
tools/scripts/pack-tool.mjs      Pattern/Capability Pack commands
tools/scripts/registry-tool.mjs  canonical registry sync/check
tools/scripts/e2e-test.mjs       isolated regression fixture runner
        ↓
tools/lib/common.mjs             shared filesystem/frontmatter/render helpers
```

Legacy duplicate implementations were removed in v4.1 so package scripts and CI cannot execute different semantics.

## Normal project validation

```bash
cd tools
npm ci
npm run docs:all
```

`docs:all` performs registry drift check, profile check, pack validation, documentation validation, generated traceability sync, static site build, and site link checking.

## Full framework QA

```bash
npm run qa
```

In addition to `docs:all`, this runs the E2E fixture under `tools/tests/fixtures/valid-project` in a temporary workspace. The fixture must produce 6 typed entities and 6 typed edges, and a deliberately broken relation must fail validation.

## Registry commands

```bash
npm run registry:sync
npm run registry:check
```

Only `registry/*.json` is canonical. YAML mirrors are regenerated under `registry/_generated/`.

## Reuse commands

```bash
npm run pack:list
npm run pack:validate
npm run reuse:assess -- --name AUTH --occurrences 4 --similarity 0.8 --stability stable --security-baseline
npm run pack:import -- ../reusable-modules/auth-standard
npm run pack:import -- ../reusable-modules/auth-standard --apply --features register,google-login --set GOOGLE_LOGIN_ENABLED=true
npm run pack:review -- auth-standard --approve --note "Reviewed by Product and Tech Lead"
npm run pack:diff -- auth-standard --source ../../library/auth-standard-1.1.0
npm run pack:upgrade -- auth-standard --source ../../library/auth-standard-1.1.0
```

Import/upgrade are preview-first. Project-local docs become source of truth. Pack state and snapshots stay under `.project-docs/`.
