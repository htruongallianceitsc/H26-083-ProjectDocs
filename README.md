# Production Project Documentation Starter Kit v5.4

Documentation-first starter kit for long-lived Web, Mobile and API projects, now with a governed source workspace and versioned Source Base bootstrap profiles.

## Core model

```text
Idea / Request
      ↓
Select Spec Level
      ↓
Canonical Docs + Application Boundaries
      ↓
Ready Gate
      ↓
Reviewed WorkPlan (with application/source scope)
      ↓
Implementation Tasks
      ↓
apps/* / adopted source roots
      ↓
Documentation reconciliation + Done Gate
      ↓
ChangeSet / Baseline
```

## What v5.4 adds

- `application` is a first-class typed entity under `docs/24-applications/`.
- `applications` is a typed relation that can connect Features/Tasks to deployable app boundaries.
- `registry/source-profiles.json` defines stack-specific source conventions.
- `source-bases/` contains versioned bootstrap skeletons for React SPA, Next.js, React Native/Expo, Flutter/BLoC, iOS/SwiftUI and Android/Compose.
- `.project-docs/source.lock.json` records source-base/adoption provenance.
- `source:init` materializes a Source Base into project source.
- `source:adopt` registers an existing codebase without forcing a move.
- `source:check` validates application roots against their selected Source Profile/Base.
- `source:upgrade-check` reports newer base versions but never overwrites project source.
- WorkPlan schema `1.2` snapshots `applicationScope`.
- Static docs add a **Source Workspace** page.

## Source workspace convention

For new projects prefer:

```text
apps/
├── web/
├── api/
├── mobile/
└── ...
packages/
├── shared/
├── contracts/
└── ...
```

The root layout is stable across stacks; the internal layout of each app is selected by its Source Profile. Existing projects may keep `frontend/`, `mobile/`, or other roots and register them with `source:adopt`.

## Source Base vs Capability Pack

- **Source Base** = technology/application bootstrap skeleton.
- **Capability Pack** = reusable product/domain capability documentation.
- **Pattern Pack** = reusable implementation/documentation pattern.
- **Standard** = rules and constraints.

After `source:init`, the copied code becomes project-owned canonical source. Source Bases are not live dependencies.

## Start

1. Read `START_HERE.md`.
2. Configure documentation depth in `project.profile.json`.
3. Choose application/source profile(s).
4. For a new app run `source:init`; for existing code run `source:adopt`.
5. Map Features to application entities using `related.applications`.
6. Run `cd tools && npm ci && npm run qa`.
7. Use Ready → WorkPlan → Tasks before implementation.

## Key source commands

```bash
cd tools

npm run source:list
npm run source:recommend -- --type web --stack reactjs
npm run source:init -- --code APP-WEB --profile react-spa --variant production
npm run source:adopt -- --code APP-WEB --profile react-spa --root frontend
npm run source:check
npm run source:status
npm run source:upgrade-check -- --app APP-WEB
```

All v5.0-v5.3 governance remains: Request/WorkPlan/Task, Progressive Specification, freshness, impact analysis, ChangeSets, Baselines and root-history hygiene.

See `docs/history/V5_4_UPGRADE_NOTES.md`, `docs/history/V5_4_QA_REPORT.md`, `standards/source-workspace.md` and `standards/source-base-governance.md`.
