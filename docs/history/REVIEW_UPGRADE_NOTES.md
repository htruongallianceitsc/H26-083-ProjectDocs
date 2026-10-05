# Review Upgrade Notes — React Native Trial

Bản nâng cấp này xử lý trực tiếp các finding trong review React Native.

## P0/P1 mobile layer

- Thêm `standards/project-types/mobile/` cho architecture, lifecycle, networking, offline/sync, storage, realtime, push, permission/native capability, deep link, observability, security/privacy, UI/accessibility, performance, store release, background work, media và timezone.
- Thêm `standards/stacks/mobile/react-native/` và `standards/stacks/mobile/flutter/`.
- Thêm entity/template: permission, native-capability, deep-link, push-event, local-storage, sync-policy, background-job-mobile, analytics-event, feature-flag, device-test-profile.
- Thêm workflow Mobile Readiness và Store Release Readiness.

## Web/API/stack classification

- Project types: Web / Mobile / API.
- Stacks: ReactJS / React Native / Flutter / NodeJS API / ASP.NET Core API / PostgreSQL.
- `project-profile.json` quyết định standard nào được áp dụng.

## P2 governance/tooling

- Entity type/status được enforce từ registry.
- Relation kiểm source type -> relation key -> target type + cardinality.
- Typed traceability thay generic 2-hop; Feature -> Requirement -> Test là path explicit duy nhất được mở rộng mặc định.
- Over-link/high-degree warning + reciprocal relation warning.
- Quality rules data-driven theo project type/tags.
- Dependency-hash stale detection.
- Machine-readable Open Question lifecycle + blocking gate.
- Frontmatter schema-driven validation.
- Duplicate API/route, path/method format, code prefix và broken stable-code reference lint.
- Static site có Profile + Applicable Standards view ngoài Catalog/Traceability/Graph/Diagrams.

## Deliberate limitation

Mermaid validator mặc định làm structural lint để giữ Node toolchain zero-dependency. Browser dùng Mermaid thật để render; có thể vendor Mermaid local bằng `npm run docs:vendor`. Nếu team cần parser/CLI validation sâu trong CI, có thể cài Mermaid CLI như optional CI dependency mà không thay source-of-truth model.

## v3 — Reusable Capability Pack Layer

Added after reuse review `DOC-REUSE-AUTH-PACKS`:

- three-layer Starter Core / Capability Pack Library / Project Workspace model;
- `registry/capability-pack.schema.json`;
- `.project-docs/packs.lock.json` and immutable base snapshots;
- preview-first selective import with variables, optional features and deterministic namespace remap;
- pack provenance separated from business frontmatter;
- `pack:validate`, `pack:import`, `pack:diff`, `pack:upgrade`, `pack:review`;
- three-way base/local/upstream upgrade proposals;
- no automatic conflict/deletion overwrite;
- implementation gate for pending pack review;
- `auth-standard@1.0.0` executable reference pack;
- static-site Capability Packs inventory.
