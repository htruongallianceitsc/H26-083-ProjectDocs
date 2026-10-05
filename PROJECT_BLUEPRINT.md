# Project Blueprint

This is the inventory map for a real project created from the starter. Every important Module, Feature, Screen/Route, API, DB object, Integration, critical Test and mobile-specific entity should appear here and have a detailed canonical document.

## Project Profile
- Default spec level: `<lightweight|standard|full|auto>`
- Target maturity: `<concept|prototype|uat|production>`
- Project code: `<PROJECT_CODE>`
- Project types: `<web|mobile|api>`
- Technology stacks: `<reactjs|nextjs|react-native|flutter|ios-swiftui|android-compose|nodejs-api|dotnet-core-api|postgresql>`


## Applications / Source Boundaries
| Code | Type | Source Profile | Technology Stack | Source Root | Origin/Base |
|---|---|---|---|---|---|
| APP-WEB | web | react-spa | reactjs | `apps/web` | `react-spa@1.0.0/production` |

Every deployable app should have a canonical `application` document in `docs/24-applications/`. Source Base provenance belongs in `.project-docs/source.lock.json`.

## Reuse Inventory
| Capability | Decision | Package/Standard | Version | Review |
|---|---|---|---|---|
| AUTH | `<standard/pattern/capability>` | `<id/path>` | `<version>` | `<status>` |

## Modules
| Code | Module | Purpose | Reuse Source |
|---|---|---|---|

## Features
| Code | Module | Feature | Applications | Spec Level | Maturity | Requirements | Screens | APIs | Tests |
|---|---|---|---|---|---|---|---|---|---|

## Screens / Routes
| Code | Route | Feature | Platform |
|---|---|---|---|

## APIs
| Code | Method | Path | Feature |
|---|---|---|---|

## Database Objects
| Code | Schema/Object | Feature/Owner |
|---|---|---|

## Mobile Inventory (when applicable)
| Type | Code | Feature | Notes |
|---|---|---|---|
| Permission | | | |
| Deep Link | | | |
| Push Event | | | |
| Sync Policy | | | |
| Local Storage | | | |
| Device Test Profile | | | |

## External Integrations
| Code | Provider | Purpose | Owner |
|---|---|---|---|

## Open Questions / Decisions
Track blockers and accepted decisions explicitly; do not hide assumptions in prose.

## Change / Implementation Governance

### Active Requests
| Code | Kind | Status | Promoted To |
|---|---|---|---|

### WorkPlans
| ID | Feature | Applications | Spec Level | Maturity | Status | Context Review |
|---|---|---|---|---|---|---|

### Implementation Tasks
| Code | Feature | WorkPlan | Status |
|---|---|---|---|

> Requests explain why change entered the project. WorkPlans explain the reviewed implementation plan. Tasks execute the plan. None of these replace canonical Feature/Requirement/Rule/API/Screen/DB/Test documentation.


## v5.6 Workspace Layout

The repository separates five concerns explicitly:

- `docs/` — canonical project knowledge.
- `apps/`, `packages/`, `tests/`, `infra/` — implementation/source workspace.
- `kit/` — reusable starter-kit framework assets.
- `tools/` — executable local tooling.
- `.project-docs/` — governance/runtime/generated state, including `.project-docs/site/`.

Physical locations are defined in `starter-kit.json.workspaceLayout`; v5.5 root names are migration aliases only.

## v5.5 Engineering Knowledge Runtime

The blueprint now includes a local intelligence layer:

```text
Canonical Markdown Entities <-> Typed Relation Graph
          |                         |
          v                         v
     Search / Query             Context Packs
          ^                         ^
          |                         |
       Source Index <--- Source Files / Git Diff
          |
          v
   Potential Impact
```

This layer is intentionally derived. Canonical project knowledge stays in `docs/`; implementation truth stays in project source roots.

