# Production Project Documentation Starter Kit v5.9


Documentation-first starter kit for long-lived Web, Mobile and API projects. v5.9 adds Blueprint Projection & Progressive Documentation: start from one `PROJECT_BLUEPRINT.md`, promote reviewed detail into canonical documents only when needed, and compile/render the current knowledge graph back into Blueprint views by detail level and audience.

## Core model

```text
Idea / Request
      |
      v
Progressive Specification
      |
      v
Canonical Docs + Typed Project Graph
      |
      +----> Local Search / Query / Context
      |
      +----> Source Intelligence <---- Git Changes
      |              |
      |              v
      |         Potential Impact
      v
Ready Gate -> Reviewed WorkPlan -> Implementation
      ^                               |
      |                               v
Docs Reconciliation <- Tests <- Source Changes
      |
      v
Done Gate -> ChangeSet / Baseline
```


## What v5.9 adds

### 1. One-file progressive project entry point

`PROJECT_BLUEPRINT.md` can begin as the canonical lightweight seed for Modules, Features, Requirements, Business Rules, Screens, APIs, Database Objects and Test Cases. `blueprint:expand` turns seed rows into reviewable candidates instead of silently creating documents.

### 2. Progressive ownership instead of duplicate truth

Blueprint items use `inline`, `linked` or `generated` ownership. Before promotion, the inline Blueprint seed owns the knowledge. After reviewed promotion, the detailed document under `docs/` owns it and the Blueprint becomes a generated summary/reference. Generated projections are never canonical.

### 3. Docs → Blueprint compilation

`blueprint:compile` reads canonical typed entities, relations and verification coverage, then refreshes only the managed projection block in `PROJECT_BLUEPRINT.md`. Human-authored seed sections outside that block are preserved.

### 4. Independent detail and audience projections

`blueprint:render` supports detail profiles `overview`, `lightweight`, `standard`, `full` and audiences `general`, `business`, `developer`, `qa`. Derived files live under `.project-docs/blueprint/rendered/`.

### 5. Round-trip drift and conflict protection

`blueprint:diff`, `blueprint:check` and `blueprint:reconcile` track linked source hashes and Blueprint seed hashes. Editing both a promoted seed row and its linked canonical document is reported as a conflict; automatic reconciliation only prefers the linked canonical document.

## v5.8 Acceptance & Verification capabilities retained

### Stable Acceptance Criteria and exact verification


### 1. Stable Acceptance Criteria without AC entity explosion

Requirements now use stable `AC-*` rows under `## Acceptance Criteria`. The permanent address is `REQ-CODE#AC-ID`; Acceptance Criteria remain sub-addresses of the Requirement rather than standalone Markdown entities.

### 2. Exact Test → Acceptance mapping

Test Cases use `acceptance_criteria: [REQ-...#AC-01]` while retaining normal `related.requirements` graph links. Invalid or uncovered AC references are detected automatically.

### 3. Business Rule verification polarity

Critical Business Rules can require both positive and negative evidence. Test Cases declare `business_rule_cases: [BR-...#positive]` or `BR-...#negative`; approved critical rules missing either side fail verification.

### 4. Verification quality gate and dashboard

`verification:status` and `verification:check` generate `.project-docs/reports/verification-report.json`, feed `docs/_generated/verification.json`, appear in the static Verification page, and participate in Ready/Done evaluation for related Feature context. `npm run qa` includes verification checking.

### 5. Explicit verification relations

The relation registry now includes explicit Requirement → Business Rule, Test Case → Business Rule, and Business Rule → Test Case mappings so verification links no longer depend on broad fallback rules.

## v5.7 Brownfield capabilities retained

### Brownfield adoption is first-class

Existing code can enter the docs-first model without pretending the docs came first:

```text
source:adopt
  -> brownfield:inventory
  -> brownfield:candidates
  -> brownfield:review
  -> brownfield:promote
  -> brownfield:reconcile
  -> gate:baseline
  -> brownfield:baseline
  -> normal Ready / WorkPlan / Done lifecycle
```

`source:adopt` marks the project adoption state as brownfield/in-progress. Inventory, candidates, reconciliation and refactor proposals live under `.project-docs/brownfield/` and remain derived evidence until reviewed.

### Candidate review before canonical promotion

`kit/registry/brownfield.json` defines confidence thresholds and safety policy. `autoPromote` is disabled by default. Candidates can represent Features, Screens, APIs, Database Objects and Tests; promotion requires an explicit accepted review. Promoted Features start as lightweight reverse-engineered specs so teams can progressively reconcile business intent without losing source provenance.

### Brownfield reconciliation and baseline gate

`brownfield:reconcile` checks high-confidence review completion, accepted-but-unpromoted candidates, missing source evidence and other adoption gaps. `gate:baseline` blocks the initial brownfield baseline while high-severity findings remain. `brownfield:baseline` uses the existing Baseline engine and records the reconciled adoption state in `project.profile.json`.

### Safe source-normalization planning

`brownfield:refactor-plan` proposes movement from legacy roots toward `apps/`, `packages/`, `tests/` and `infra/`, but never moves files. The generated plan explicitly requires a reviewed WorkPlan before execution and lists build/test/source/QA verification steps.

### Technology-aware discovery hints

The brownfield registry includes adapter hints for React SPA, Next.js, React Native/Expo, Flutter/BLoC, ASP.NET Core API and Node.js API. These adapters classify evidence; they do not decide business truth.

## v5.6 workspace-layout capabilities retained

- Compact root workspace with framework assets under `kit/`.
- Centralized `starter-kit.json.workspaceLayout`.
- Static site under `.project-docs/site/`.
- `layout:check` and controlled `layout:migrate`.

## v5.5 knowledge runtime retained


### 1. Hardened entity and relation model

- Permanent UUID `uid` for machine identity.
- Local semantic `revision` for governed edits.
- Explicit `initialStatus`, lifecycle transitions and terminal statuses for all 32 entity types.
- Semantic relation metadata with exact-rule precedence, min/max cardinality, unresolved-target policy and compatibility fallbacks.
- `entity:identity-backfill` for legacy Markdown entities.
- `entity:transition` for lifecycle-safe status changes.

### 2. Source intelligence and Git impact

- `kit/registry/source-intelligence.json` defines scan and mapping behavior.
- `.project-docs/indexes/source-index.json` is a disposable derived source index.
- Lightweight symbol/import/dependency/dependent extraction.
- Source file -> entity evidence through application roots, explicit mappings, entity-code mentions and technical identifiers.
- `source:map` explains why a file maps to an entity.
- `git:status` and `git:impact` map changed files into graph-based potential impact.

### 3. Local knowledge engine and Doctor

- Rebuildable entity/relation/search indexes under `.project-docs/indexes/`.
- Full-text `search` across metadata and document bodies.
- Field-aware `query` with boolean expressions and graph scope.
- Bounded `context` packs that combine project graph and source evidence for AI agents.
- Reusable views in `kit/registry/views.json`.
- `doctor` detects identity, relation and stale-index problems; `doctor --fix` performs safe derived-state repairs.

## v5.4 capabilities retained

- Progressive Specification: Lightweight / Standard / Full.
- Application entities and governed source roots.
- Versioned Source Bases for React SPA, Next.js, React Native/Expo, Flutter/BLoC, iOS/SwiftUI and Android/Compose.
- Capability Packs, Pattern Packs and reuse governance.
- Request -> Ready Gate -> reviewed WorkPlan -> Task workflow.
- Documentation freshness, impact analysis, ChangeSets and Baselines.
- Static offline documentation site and CI-ready QA.

## Start

```bash
cd tools
npm ci
npm run qa
```

For an existing project, backfill permanent entity identities once:

```bash
npm run entity:identity-backfill
npm run entity:identity-backfill -- --apply
```

Then build local engineering intelligence:

```bash
npm run source:scan
npm run knowledge:reindex
npm run doctor
```


Blueprint commands:

```bash
npm run blueprint:init
npm run blueprint:expand -- --profile standard
npm run blueprint:status
# review candidate IDs before promotion
npm run blueprint:review -- --candidate BP-... --decision accepted --reviewer "Reviewer"
npm run blueprint:promote -- --candidate BP-... --reviewer "Reviewer"
npm run blueprint:compile -- --profile standard --audience general
npm run blueprint:render -- --profile overview --audience business
npm run blueprint:diff
npm run blueprint:check
```

Acceptance and verification commands:

```bash
npm run verification:status
npm run verification:check
```

Typical discovery commands:

```bash
npm run search -- --text "reset password"
npm run query -- --expr "type=feature AND status=in_progress"
npm run context -- --entity FEAT-AUTH-LOGIN
npm run source:map -- --entity FEAT-AUTH-LOGIN
npm run git:impact
```

For an existing source project, use the governed brownfield flow:

```bash
npm run source:adopt -- --code APP-WEB --profile react-spa --root legacy-web
npm run brownfield:inventory -- --app APP-WEB
npm run brownfield:candidates -- --app APP-WEB
npm run brownfield:status
# review candidate IDs before promotion
npm run brownfield:review -- --candidate CAND-... --decision accepted --reviewer "Reviewer"
npm run brownfield:promote -- --candidate CAND-... --reviewer "Reviewer"
npm run brownfield:reconcile -- --app APP-WEB
npm run gate:baseline -- --app APP-WEB
npm run brownfield:baseline -- --app APP-WEB --actor "Team"
```

If physical normalization is desired, run `brownfield:refactor-plan`; convert the proposal into a reviewed WorkPlan before changing source paths.

## Sources of truth

- Before promotion, an `inline` item in `PROJECT_BLUEPRINT.md` may be canonical lightweight knowledge. After promotion, the linked Markdown project entity in `docs/` becomes canonical for that item.
- Real implementation under `apps/`, `packages/`, `tests/` and adopted source roots remains canonical source code.
- Registry JSON files define model and governance behavior.
- Files under `.project-docs/indexes/`, `.project-docs/reports/`, `docs/_generated/` and `.project-docs/site/` are derived and rebuildable.

See `docs/history/V5_9_UPGRADE_NOTES.md`, `docs/history/V5_8_UPGRADE_NOTES.md`, `docs/history/V5_7_UPGRADE_NOTES.md`, `docs/history/V5_6_UPGRADE_NOTES.md`, `docs/history/V5_5_UPGRADE_NOTES.md`, `kit/standards/entity-identity-lifecycle-and-relations.md`, `kit/standards/source-intelligence.md`, and `kit/standards/local-knowledge-engine.md`.
