# Production Project Documentation Starter Kit v5.6

Documentation-first starter kit for long-lived Web, Mobile and API projects. v5.6 keeps the v5.5 knowledge runtime intact while reorganizing the repository root into a smaller, clearer workspace: project knowledge, implementation source, reusable starter-kit assets, tooling, and generated/runtime state are now separated explicitly.

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

## What v5.6 adds

### 1. Compact root workspace

The root is now limited to project entry files plus first-class project/source/runtime directories. Framework assets no longer compete visually with project implementation.

```text
/
├── README.md
├── START_HERE.md
├── PROJECT_BLUEPRINT.md
├── project.profile.json
├── starter-kit.json
├── docs/
├── apps/
├── packages/
├── tests/
├── infra/
├── kit/
├── tools/
├── .project-docs/
└── .github/
```

### 2. Unified `kit/` framework surface

- `kit/registry/` — machine-readable governance and model configuration.
- `kit/standards/` — core, project-type, stack and reuse standards.
- `kit/prompts/`, `kit/templates/`, `kit/workflows/` — authoring/orchestration assets.
- `kit/source-bases/` — versioned greenfield source bases.
- `kit/reuse/` — capability packs, pattern packs and reusable templates.
- `kit/examples/` — starter examples such as the project profile sample.

### 3. Centralized workspace layout

`starter-kit.json.workspaceLayout` is the canonical physical-layout map. Tooling exposes layout helpers and a compatibility alias layer so v5.5 logical roots can still be resolved during migration. Use `npm run layout:check` to validate the canonical structure and `npm run layout:migrate -- --apply` when moving a legacy workspace.

### 4. Generated site moved out of root

The static documentation site now lives under `.project-docs/site/`, alongside other derived/runtime artifacts. It remains fully rebuildable with `npm run docs:build`.

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

## Sources of truth

- Markdown project entities in `docs/` remain canonical business/project knowledge.
- Real implementation under `apps/`, `packages/`, `tests/` and adopted source roots remains canonical source code.
- Registry JSON files define model and governance behavior.
- Files under `.project-docs/indexes/`, `.project-docs/reports/`, `docs/_generated/` and `.project-docs/site/` are derived and rebuildable.

See `docs/history/V5_6_UPGRADE_NOTES.md`, `docs/history/V5_5_UPGRADE_NOTES.md`, `kit/standards/entity-identity-lifecycle-and-relations.md`, `kit/standards/source-intelligence.md`, and `kit/standards/local-knowledge-engine.md`.
