# START HERE - v5.15

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

## 0A. Moving project documentation from an older starter?

Do not manually copy old `docs/` folders into the new base. If the source project is already v5.15+, export there:

```bash
cd tools
npm run docs:export
```

If the source project is v5.14 or older and therefore has no `docs:export` command, use the **new v5.15 toolchain** to read it directly; the old project does not need to be upgraded first:

```bash
cd <new-v5.15-project>/tools
npm run docs:export -- --source ../../OldProject
```

By default the ZIP is written into the source project's `.project-docs/exports/ProjectDocsExport.zip`. Copy that ZIP to the project created from the newer starter and import it:

```bash
cd tools
npm run docs:import -- --file ../ProjectDocsExport.zip
```

The importer maps entity types into the current folder structure, preserves `uid`/`code`, fills missing legacy UID/revision values, skips identical entities, reports changed-target conflicts, and rebuilds documentation projections. Preview first when needed:

```bash
npm run docs:import -- --file ../ProjectDocsExport.zip --dry-run
```

Use `--on-conflict replace` only after reviewing the generated conflict report. See `docs/guides/documentation-bundles.md`.

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

## 1C. Want to inspect the project Screen-first? Start an optional wireframe review

Use this only when you want to focus on UI completeness before continuing detailed functional/technical authoring.

```bash
cd tools
npm run wireframe:start -- --scope all
npm run wireframe:build
```

Or scope the review:

```bash
npm run wireframe:start -- --feature FEAT-AUTH-LOGIN
npm run wireframe:start -- --screens SCR-AUTH-LOGIN,SCR-AUTH-FORGOT-PASSWORD
```

Open `docs/_generated/SCREEN_WIREFRAMES.html`. v5.14 renders a **composition-aware, platform-aware low-fidelity visual canvas** from Screen-local visual sections plus optional `screen-shell` and `ui-component` sources. Shared Header/Bottom Navigation ownership and Screen slot overrides are visible beside the canvas, while fields, User/Lifecycle/System/API actions, states and navigation remain on the Screen contract. The main canvas shows one primary visible state; modal/popover/hover-only UI belongs under `Hidden / Secondary UI`. If the canvas is too vague, use `kit/prompts/51-visual-wireframe-layout-enrichment.md` and `kit/templates/screen-visual-spec-template.md`, update the canonical Screen, then rebuild.

Record anything missing as a governed proposal:

```bash
npm run wireframe:gap -- --screen SCR-APP-SPLASH --kind startup-flow-gap --severity high --summary "Startup config flow is missing canonical coverage"
npm run wireframe:resolve -- --proposal WFG-... --status accepted --reviewer "Reviewer"
```

If the gap needs new canonical entities, create a review-gated promotion draft:

```bash
npm run wireframe:promote -- --proposal WFG-... --preset startup-bootstrap
```

Author exact codes/relations/content in the promotion JSON, set `status=authored` and `requiresAuthoring=false`, then explicitly apply:

```bash
npm run wireframe:promote -- --proposal WFG-... --plan .project-docs/wireframes/promotions/authored-startup.json --apply --reviewer "Reviewer"
```

For reusable Screen chrome, define shared sources first:

```text
UI-CMP-MOBILE-HEADER + UI-CMP-MOBILE-BOTTOM-NAV
                  -> UI-SHELL-MOBILE-MAIN
                  -> SCR-HOME / SCR-TASK-LIST / SCR-PROJECT-LIST
```

Then keep only Screen-specific values in `Shared UI Overrides` (for example Header title/right actions and Bottom Tab active item). See `kit/examples/shared-ui-composition/`.

For normal edits to existing canonical docs, update them through the normal governed edit/proposal path, resolve the gap, rebuild and close the session:

```bash
npm run wireframe:resolve -- --proposal WFG-... --status resolved --reviewer "Reviewer"
npm run wireframe:build
npm run wireframe:check
npm run wireframe:close -- --reviewer "Reviewer"
```

The HTML/ASCII files are projections only. Never use generated wireframes as a second source of truth. Visual completeness warnings are expected until the Screen explicitly defines its platform/viewport, primary state, regions and component inventory.

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
