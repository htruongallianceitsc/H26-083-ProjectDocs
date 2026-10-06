# Production Project Documentation Starter Kit v5.13


Documentation-first starter kit for long-lived Web, Mobile and API projects. v5.13 upgrades optional **Screen-First Wireframe Analysis** into a platform-aware visual placeholder workflow: Screen docs can describe viewport, layout regions, typed visible components and secondary UI so the generated HTML looks like a real low-fidelity wireframe while canonical documentation remains the source of truth.

## Core model

```text
Idea / Request                 Mockups / Visual Evidence
      |                              |
      |                              v
      |                      Vision Analysis + Review
      |                              |
      +--------------+---------------+
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


## What v5.13 adds

### 1. Platform-aware visual placeholder canvas

Each Screen can declare `Visual Display Profile` with Web/Mobile platform, representative viewport, canvas mode and primary visible state. The HTML renderer preserves the target aspect ratio (for example 1440x900 web or 390x844 mobile) instead of rendering every Screen as the same generic box.

### 2. Explicit visual layout regions

`Visual Layout Regions` defines the visible hierarchy using semantic placement such as top/left/main/right/bottom and row/column/grid. This is enough to review header/sidebar/main/aside/mobile composition without turning the docs into production CSS.

### 3. Typed component placeholders

`Visible Components` supports low-fidelity roles such as logo, image/hero, heading/text, button/link, tabs, fields, card-grid, list, table, chart, stat and navigation. The generated wireframe therefore makes it visually obvious which block is which.

### 4. One primary state on canvas; secondary UI outside

The main canvas normally shows `Success / Data Ready` (or another explicitly selected state such as Splash `Loading`). Modal, popover, hover/focus UI, expanded dropdowns and confirmation dialogs are documented under `Hidden / Secondary UI` and shown beside the canvas rather than cluttering the default Screen.

### 5. Visual completeness gaps

Active Screen-first sessions now report inferred/missing viewport, display profile, layout regions, primary state and typed component inventory. Safe placeholders may be derived from existing Sections/Fields/User Actions for review, but the warnings remain until the canonical Screen is enriched.

### 6. Visual enrichment workflow

Use `kit/prompts/51-visual-wireframe-layout-enrichment.md`, `kit/templates/screen-visual-spec-template.md` and Workflow 24 to iterate: generate -> inspect -> record visual gap -> enrich Screen -> rebuild. The generated HTML never becomes a second source of truth.

## What v5.12 adds

### 1. Screen behaviour is no longer limited to buttons

Screen contracts now separate **User Actions**, **Lifecycle Actions**, **System Actions** and **API Interactions**. Splash/bootstrap, auto-refresh, redirect and background-driven Screens can therefore describe real behaviour without inventing user controls.

### 2. Startup / bootstrap flows are first-class Screen-first discoveries

A Splash Screen can explicitly document `onEnter -> load config -> loading state -> success navigation / failure state`, while Feature, Requirement, Flow, API and Test remain separate canonical owners for their respective semantics.

### 3. New governed gap kinds

Screen-first review can now record missing Screen, lifecycle action, system action, API interaction, startup-flow and test gaps in addition to existing field/action/state/navigation gaps.

### 4. Gap promotion is authoring-gated

`wireframe:promote` can turn an **accepted** gap into a draft multi-entity promotion plan. Presets such as `startup-bootstrap` suggest the likely entity types and questions, but the plan remains `requiresAuthoring=true` until exact codes, relations and content are reviewed.

### 5. Explicit multi-entity materialization

After a promotion plan is authored, `wireframe:promote --apply` can create new Feature/Requirement/Rule/Screen/Flow/API/Test docs together. Existing entity codes are protected from overwrite by default.

## What v5.11 adds

### 1. Optional Screen-First Analysis Mode

When a team wants to reason from Screens first, start a focused wireframe review session without changing the normal Documentation-First lifecycle. Scope may be all Screens, one Feature, one Module or an explicit Screen list.

### 2. One semantic projection, three review formats

Canonical Screen docs are projected into a structured Screen contract. The same contract renders to text, ASCII and HTML, avoiding three competing truths. Text is optimized for AI/Git review, HTML for humans, ASCII for quick terminal/chat inspection.

### 3. Combined standalone HTML wireframe

`docs/_generated/SCREEN_WIREFRAMES.html` gathers all Screens in scope into one searchable file with route, Feature/Requirement context, fields, actions, states, navigation and visible `TBD` markers. Known Screen-code destinations become clickable anchors for lightweight flow walkthroughs.

### 4. Review gaps flow back to canonical docs

`wireframe:gap` records missing actions, fields, states, navigation, Feature/Requirement ownership and other issues as governed proposals. Accepted gaps must be resolved in canonical documentation; generated HTML is never edited as business truth.

### 5. Stale projection and session gate

While a Screen-first session is active, changed Screen docs make projections stale and accepted unresolved gaps can block session closure. When the mode is inactive, normal project QA is unaffected.

## What v5.10 adds

### 1. `mockups/` as a governed design-evidence input

Put UI screenshots/wireframes/design exports under `mockups/`. `mockup:inventory` records path/hash/dimensions and naming hints without pretending to understand the UI.

### 2. Vision-analysis contract instead of blind document generation

`mockup:tasks` identifies images that need semantic analysis. A vision-capable agent writes structured JSON evidence under `.project-docs/mockups/analysis/` using `kit/prompts/46-mockup-to-documentation.md`.

### 3. Review-gated Screen generation

`mockup:candidates` groups multiple images into logical Screens/states. New Screen candidates can become draft Screen docs only after review; existing Screens default to an enrichment proposal rather than automatic overwrite.

### 4. Mockup → Screen traceability and drift checks

Screen docs can carry `mockup_refs`. `mockup:report` generates `docs/_generated/MOCKUP_TRACEABILITY.md`; `mockup:check` detects missing/stale analysis, unmapped screen mockups, broken refs, and images changed after promotion.

### 5. Strong source-of-truth boundary

Mockups are **design evidence**, not business truth. Visible layout/text/states may seed Screen docs; APIs, DB schema, hidden rules, permissions and non-visible edge cases remain TBD/Open Questions until confirmed by canonical sources.

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
