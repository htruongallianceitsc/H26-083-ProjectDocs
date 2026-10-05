# Start Here - v4

## Phase 0 - Profile
Edit `project.profile.json` with project types and technology stacks, then run:

```bash
cd tools
npm run profile:check
```

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
