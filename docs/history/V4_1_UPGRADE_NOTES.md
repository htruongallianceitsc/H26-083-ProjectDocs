# Starter Kit v4.1 Upgrade Notes

V4.1 is the stabilization step before the v5.0 documentation-to-implementation workflow.

## Scope deliberately included

1. **Version normalization**
   - `starter-kit.json` is now `4.1.0` / schema `4.1.0`.
   - `tools/package.json` is `4.1.0`.
   - Project profile/site/tooling labels are aligned to v4.1.

2. **Canonical registry model**
   - `registry/*.json` is the only editable registry source.
   - Hand-maintained YAML copies were removed.
   - `npm run registry:sync` generates YAML mirrors under `registry/_generated/`.
   - `npm run registry:check` fails when mirrors drift or registry references are invalid.

3. **Single runtime/toolchain**
   - The supported runtime is `tools/scripts/*` + `tools/lib/common.mjs`.
   - The unused parallel `tools/src/*` implementation and legacy per-command scripts were removed.
   - `implementationGate.blockOnPackReviewPending` is now the single profile path used by schema, example, runtime and project profile.

4. **Pack contract cleanup**
   - Capability Pack schema now matches the manifests actually used by the runtime.
   - Reference Capability/Pattern Packs target starter schema `4.1.0`.
   - Pack validation rejects a different starter schema major version.
   - The obsolete manifest example format was replaced with the live format.

5. **Executable regression fixture**
   - Added `tools/tests/fixtures/valid-project`.
   - The fixture contains Module, Feature, Requirement, Screen, API and Test Case entities.
   - E2E expects exactly 6 entities and 6 typed edges.
   - A negative test deliberately introduces a broken relation and requires validation to fail with `BROKEN_RELATION`.

6. **Real CI gate**
   - Added `.github/workflows/docs.yml`.
   - CI runs `npm ci` and `npm run qa` on documentation/tooling/registry changes.

## Scope deliberately deferred to v5.0+

V4.1 does **not** add Task, Bug, Change Request, WorkPlan, machine-enforced Definition of Ready/Done, dependency freshness, ChangeSet/Baseline or source-code intelligence. Those remain roadmap items so this release stays focused on deterministic foundations.

## Upgrade checklist from v4

```bash
cd tools
npm ci
npm run registry:sync
npm run qa
```

Expected result: registry/profile/pack/docs/site checks pass and E2E regression reports `PASS`.
