# Start Here - v4.1

## Phase 0 - Verify the starter kit

Before creating project documentation, verify registry/runtime consistency:

```bash
cd tools
npm ci
npm run registry:check
npm run profile:check
```

`registry/*.json` is canonical. Files under `registry/_generated/` are generated mirrors only.

## Phase 1 - Idea and scope

Use workflows 01 and 02 plus prompts 01-03 to create Project Overview, Scope and Blueprint.

## Phase 2 - Reuse decision before detailed decomposition

Run workflow `03A-reuse-capability-detection.md`.

```bash
npm run pack:list
npm run pack:validate
```

For a new repeat candidate:

```bash
npm run reuse:assess -- --name AUTH --occurrences 4 --similarity 0.8 --stability stable --security-baseline
```

Use an existing pack only after preview and review. Otherwise generate from applicable Standards.

## Phase 3 - Functional and technical documentation

Continue workflows 03-05: Module/Feature -> Requirement/Rule -> Screen/Flow -> API/DB/Integration -> Test.

## Phase 4 - Production readiness

Run security, NFR, deployment, observability, runbook and release workflows.

## Phase 5 - Validate and browse

```bash
npm run docs:all
npm run docs:serve
```

Open `http://127.0.0.1:4173`.

## Phase 6 - Full starter-kit regression

When changing the starter-kit framework, registries, reuse engine, or tooling, run:

```bash
npm run qa
```

`qa` runs the normal documentation pipeline plus an isolated E2E fixture that proves a real Module -> Feature -> Requirement/Screen/API/Test graph can validate, sync, build, and detect a deliberately broken relation.
