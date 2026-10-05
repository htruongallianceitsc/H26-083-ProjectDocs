# Project Blueprint

This file is the progressive entry point to project knowledge. Keep early/lightweight items inline here; once an item is reviewed and promoted, its detailed Markdown document becomes canonical and this Blueprint only projects a summary/reference. Generated projection blocks are rebuildable.


<!-- BLUEPRINT_PROJECTION:START -->

## Current Project Projection

> Projection profile: **standard** · audience: **general** · generated from canonical project knowledge.

## Project Summary

- Project code: `STARTER`
- Project types: not selected
- Technology stacks: not selected
- Canonical entities included: 0
- Acceptance coverage: 100%

<!-- BLUEPRINT_PROJECTION:END -->

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


## Requirements
| Code | Feature | Requirement | Behaviour | Acceptance |
|---|---|---|---|---|

## Business Rules
| Code | Feature | Rule | Criticality |
|---|---|---|---|

## Test Cases
| Code | Feature | Title | Verifies | Acceptance Criteria | Business Rule Cases |
|---|---|---|---|---|---|

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



## v5.9 Blueprint Projection & Progressive Documentation

Ownership is explicit:

- `inline` — this Blueprint seed is canonical.
- `linked` — a detailed canonical document under `docs/` owns the item.
- `generated` — derived profile/audience output; do not edit.

Typical lifecycle:

```text
PROJECT_BLUEPRINT.md
  -> blueprint:expand
  -> review
  -> blueprint:promote
  -> canonical docs
  -> blueprint:compile / blueprint:render
```

Detail profiles: `overview`, `lightweight`, `standard`, `full`. Audience profiles: `general`, `business`, `developer`, `qa`.

## v5.8 Acceptance & Verification Traceability

Track verification quality explicitly:

- Requirement AC format: stable `AC-*` rows under `## Acceptance Criteria`.
- Fine-grained test mapping: `REQ-CODE#AC-ID`.
- Critical Business Rule coverage: positive + negative cases.
- Generated verification evidence: `docs/_generated/verification.json` and `.project-docs/reports/verification-report.json`.
- Ready/Done gates consume verification findings for the Feature context.

### Verification Summary
| Requirement / Rule | Acceptance / Polarity | Test Coverage | Status |
|---|---|---|---|
| | | | |

## v5.7 Brownfield Adoption

For projects with existing source, record the onboarding state explicitly:

- Adoption mode: `<greenfield|brownfield>`
- Strategy: `<native|adopt-in-place|normalize>`
- Baseline status: `<not-required|in-progress|reconciled>`
- Initial brownfield baseline: `<baseline id>`

Brownfield runtime evidence lives under `.project-docs/brownfield/` and is not canonical until reviewed/promoted. Track unresolved candidate/reconciliation findings before establishing the initial baseline. Source normalization proposals must become reviewed WorkPlans before physical file moves.

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

