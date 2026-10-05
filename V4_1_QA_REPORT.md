# Starter Kit v4.1 QA Report

## Result

**PASS**

Validation executed from `tools/` with Node.js tooling packaged in this starter kit.

## Commands executed

```bash
npm install --package-lock-only --ignore-scripts
npm run registry:sync
npm run registry:check
npm run qa
```

## Main starter workspace results

- Registry check: **0 errors**
- Registered entity types: **28**
- Relation rules: **31**
- Quality rules: **6**
- Profile check: **PASS**
- Capability/Pattern Pack validation: **2 packs / 0 errors**
- Documentation validation: **0 errors / 0 warnings**
- Static site link check: **0 broken links**

The starter workspace intentionally contains no project-specific typed entities, so its generated graph remains empty until a project imports/creates entities.

## E2E regression fixture

Fixture: `tools/tests/fixtures/valid-project`

The isolated fixture proves runtime behavior with real project data:

- Module: 1
- Feature: 1
- Requirement: 1
- Screen: 1
- API: 1
- Test Case: 1
- Total typed entities: **6**
- Total typed edges: **6**

The test then corrupts one Feature -> Test relation and requires validation to fail with `BROKEN_RELATION`.

Result:

```text
E2E regression: PASS (valid graph + broken-relation failure path).
```

## v4.1 regression risks covered

- JSON/YAML registry drift
- invalid relation target types referenced by registry rules
- quality rule referring to an unknown entity/relation
- version metadata drift in `starter-kit.json`
- parallel runtime semantics drift
- pack/starter major-schema incompatibility
- typed relation graph generation
- broken relation detection
- static site generation and internal-link integrity

## Deferred tests

The following are intentionally deferred to later roadmap versions because the corresponding runtime capabilities do not exist in v4.1 yet:

- Ready/Done gate tests
- WorkPlan/Task lifecycle tests
- document dependency freshness tests
- ChangeSet/Baseline tests
- source-code/OpenAPI/database reconciliation tests
