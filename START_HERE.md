# START HERE - v5.5

## 1. Configure the project

Set project type, technology stacks, default Spec Level and target maturity in `project.profile.json`.

## 2. Establish application boundaries

Create or adopt each deployable application:

```bash
cd tools
npm run source:init -- --code APP-WEB --profile react-spa --variant production
npm run source:adopt -- --code APP-API --profile aspnet-core-api --root backend
```

Features should use `related.applications` to identify implementation boundaries.

## 3. Establish permanent entity identity

New entities automatically receive `uid` and `revision`. For an upgraded project:

```bash
npm run entity:identity-status
npm run entity:identity-backfill
npm run entity:identity-backfill -- --apply
```

Use `entity:transition` for governed lifecycle changes instead of arbitrary status jumps.

## 4. Build documentation first

Create the Module -> Feature -> Requirement/Rule -> Screen/API/DB/Test knowledge required by the selected Spec Level. Exact typed relations are preferred; broad fallback relations should be reviewed.

## 5. Build source and knowledge indexes

```bash
npm run source:scan
npm run knowledge:reindex
npm run doctor
```

Indexes are derived caches and may be rebuilt at any time.

## 6. Discover focused context

```bash
npm run search -- --text "withdrawal fifo"
npm run query -- --expr "type=requirement AND status=approved"
npm run context -- --entity FEAT-WITHDRAW
npm run source:map -- --entity FEAT-WITHDRAW
```

Use bounded context instead of asking an AI agent to scan the entire repository.

## 7. Check change impact before implementation

Inside a Git repository:

```bash
npm run git:status
npm run git:impact
npm run git:impact -- --commit HEAD
```

Git impact is potential impact derived from source evidence plus the project graph.

## 8. Follow the documentation-first gate

```bash
npm run spec:check -- --feature FEAT-...
npm run gate:ready -- --feature FEAT-...
npm run plan:scaffold -- --feature FEAT-...
```

Review and approve the WorkPlan before implementation. Reconcile documentation and pass the Done Gate after source/test changes.

## 9. Run full QA

```bash
npm run qa
```
