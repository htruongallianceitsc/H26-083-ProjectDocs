# v5.4 Upgrade Notes — Source Workspace & Starter Code Profiles

## Goal

v5.4 connects the documentation-first governance system to a concrete source workspace without yet introducing deep source/Git intelligence.

## Added

- `application` entity and typed `applications` relations.
- `docs/24-applications/` canonical application-boundary docs.
- common `apps/`, `packages/`, `tests/`, `infra/` workspace roots.
- `registry/source-profiles.json` and generated YAML mirror.
- `registry/source-base.schema.json`.
- `.project-docs/source.lock.json` provenance state.
- Source Base library for React SPA, Next.js, React Native/Expo, Flutter/BLoC, iOS/SwiftUI and Android/Compose.
- `source:init`, `source:adopt`, `source:check`, `source:status`, `source:recommend`, `source:upgrade-check`, `source:validate`.
- Next.js, iOS/SwiftUI and Android/Compose technology-stack registrations/standards.
- WorkPlan schema 1.2 with `applicationScope`; 1.0/1.1 remain accepted.
- Source Workspace static-site page and application column in traceability.
- Source paths are excluded from documentation indexing, preventing source READMEs from polluting the document catalog.

## Source of truth rules

- Application entity = canonical deployable boundary.
- Project source tree = canonical implementation after bootstrap/adoption.
- `source.lock.json` = provenance/materialization state only.
- Source Base = bootstrap input only, never a live dependency.

## Compatibility

Existing v5.3 projects remain valid. They may keep source anywhere inside the workspace and register it with `source:adopt`; moving code to `apps/` is optional. Existing WorkPlan 1.0/1.1 files remain supported.

## Deferred to v6.0

- source-file indexing and symbol extraction;
- Git change → code dependency → entity impact;
- OpenAPI/DB/test scanners;
- code ↔ docs drift detection at file/symbol level.
