# START HERE - v5.10

## 0. Understand the workspace layout

- `docs/` = canonical project/business knowledge.
- `apps/`, `packages/`, `tests/`, `infra/` = implementation workspace.
- `kit/` = reusable starter-kit framework assets.
- `tools/` = executable local tooling.
- `.project-docs/` = runtime/governance/generated state, including the static site.

Validate the layout after upgrades or repository moves:

```bash
cd tools
npm run layout:check
```

## 1. Configure the project

Set project type, technology stacks, default Spec Level and target maturity in `project.profile.json`.


## 1A. Start from one Blueprint when that is the fastest path

For an early-stage project, you may keep Modules/Features and selected supporting artifacts in `PROJECT_BLUEPRINT.md` first:

```bash
npm run blueprint:init
npm run blueprint:expand -- --profile lightweight
npm run blueprint:status
```

When an item needs its own lifecycle, relations, verification or implementation planning, review and promote it:

```bash
npm run blueprint:review -- --candidate BP-... --decision accepted --reviewer "Reviewer"
npm run blueprint:promote -- --candidate BP-... --reviewer "Reviewer"
```

After promotion, edit the linked canonical document rather than maintaining duplicate detail in the Blueprint. Refresh summaries and audience views with:

```bash
npm run blueprint:compile -- --profile standard --audience general
npm run blueprint:render -- --profile overview --audience business
npm run blueprint:diff
```

`overview`, `lightweight`, `standard` and `full` control detail. `general`, `business`, `developer` and `qa` control audience.

## 1B. Starting from mockup images? Ingest them before detailed functional authoring

Put screenshots/wireframes under `mockups/`, preferably named like:

```text
mockups/auth/login__default.png
mockups/auth/login__validation-error.png
```

Then build deterministic inventory and vision-analysis tasks:

```bash
cd tools
npm run mockup:inventory
npm run mockup:tasks
```

Use `kit/prompts/46-mockup-to-documentation.md` with a vision-capable agent to write structured analyses under `.project-docs/mockups/analysis/`. Then:

```bash
npm run mockup:candidates
npm run mockup:review -- --candidate MCKC-SCR-... --decision accepted --reviewer "Reviewer"
npm run mockup:promote -- --candidate MCKC-SCR-... --reviewer "Reviewer"
npm run mockup:report
npm run mockup:check
```

Mockups may seed visible Screen structure/state only. Do not infer API, DB, hidden business rules or permissions from pixels; keep them as `TBD` / Open Questions until confirmed.

## 2. Establish application boundaries

Create or adopt each deployable application:

```bash
cd tools
npm run source:init -- --code APP-WEB --profile react-spa --variant production
npm run source:adopt -- --code APP-API --profile aspnet-core-api --root backend
```

Features should use `related.applications` to identify implementation boundaries.


## 2A. Existing project? Complete brownfield onboarding before normal feature work

After `source:adopt`, v5.9 retains the v5.7 brownfield behavior and marks adoption as `brownfield / in-progress`. Build evidence first; do not immediately move legacy source into `apps/`.

```bash
npm run brownfield:inventory -- --app APP-...
npm run brownfield:candidates -- --app APP-...
npm run brownfield:status
```

Review candidates explicitly:

```bash
npm run brownfield:review -- --candidate CAND-... --decision accepted --reviewer "Reviewer"
npm run brownfield:promote -- --candidate CAND-... --reviewer "Reviewer"
```

Then reconcile and establish the accepted initial baseline:

```bash
npm run brownfield:reconcile -- --app APP-...
npm run gate:baseline -- --app APP-...
npm run brownfield:baseline -- --app APP-... --actor "Team"
```

Only after this baseline should future changes follow the normal docs-first Ready → WorkPlan → Done flow. If the team wants to normalize legacy folders, run `brownfield:refactor-plan` and convert it to a reviewed WorkPlan; the brownfield tool never moves source automatically.

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

## 4A. Make acceptance and verification traceable

For each Standard/Full Requirement, use stable AC rows:

```markdown
| ID | Type | Scenario | Criterion |
|---|---|---|---|
| AC-01 | happy-path | Valid action | Given ... When ... Then ... |
```

Map Test Cases precisely:

```yaml
acceptance_criteria: [REQ-...#AC-01]
business_rule_cases: [BR-...#positive]
related:
  requirements: [REQ-...]
  business_rules: [BR-...]
```

Critical approved Business Rules should have both positive and negative Test Case coverage. Validate before planning:

```bash
npm run verification:status
npm run verification:check
```

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
