# Production Project Documentation Starter Kit v5.7


Documentation-first starter kit for long-lived Web, Mobile and API projects. v5.7 adds a governed brownfield path for projects that already have source code: adopt the existing application boundary, inventory source, generate reviewable semantic candidates, promote only accepted candidates into canonical docs, reconcile source↔docs, create an initial baseline, and optionally plan source normalization into the canonical workspace.

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

## What v5.7 adds

### 1. Brownfield adoption is now first-class

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

### 2. Candidate review before canonical promotion

`kit/registry/brownfield.json` defines confidence thresholds and safety policy. `autoPromote` is disabled by default. Candidates can represent Features, Screens, APIs, Database Objects and Tests; promotion requires an explicit accepted review. Promoted Features start as lightweight reverse-engineered specs so teams can progressively reconcile business intent without losing source provenance.

### 3. Brownfield reconciliation and baseline gate

`brownfield:reconcile` checks high-confidence review completion, accepted-but-unpromoted candidates, missing source evidence and other adoption gaps. `gate:baseline` blocks the initial brownfield baseline while high-severity findings remain. `brownfield:baseline` uses the existing Baseline engine and records the reconciled adoption state in `project.profile.json`.

### 4. Safe source-normalization planning

`brownfield:refactor-plan` proposes movement from legacy roots toward `apps/`, `packages/`, `tests/` and `infra/`, but never moves files. The generated plan explicitly requires a reviewed WorkPlan before execution and lists build/test/source/QA verification steps.

### 5. Technology-aware discovery hints

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

- Markdown project entities in `docs/` remain canonical business/project knowledge.
- Real implementation under `apps/`, `packages/`, `tests/` and adopted source roots remains canonical source code.
- Registry JSON files define model and governance behavior.
- Files under `.project-docs/indexes/`, `.project-docs/reports/`, `docs/_generated/` and `.project-docs/site/` are derived and rebuildable.

See `docs/history/V5_7_UPGRADE_NOTES.md`, `docs/history/V5_6_UPGRADE_NOTES.md`, `docs/history/V5_5_UPGRADE_NOTES.md`, `kit/standards/entity-identity-lifecycle-and-relations.md`, `kit/standards/source-intelligence.md`, and `kit/standards/local-knowledge-engine.md`.
