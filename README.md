# Production Project Documentation Starter Kit v3

Bộ khung **documentation-first** cho project production có thể gồm Web, Mobile, API/Backend hoặc nhiều surface cùng lúc. Mục tiêu là để PM/BA/UX/Dev/QA/Ops và AI Agent cùng dùng một source of truth có traceability, quality gate và static documentation portal.

## Điểm mới v3: standards theo profile + reusable capability packs

Standards được áp dụng theo thứ tự:

```text
Core Governance
   ↓
Project Type Standard
   ├── Web
   ├── Mobile
   └── API / Backend
   ↓
Technology Stack Standard
   ├── ReactJS
   ├── React Native / Expo
   ├── Flutter
   ├── NodeJS API
   ├── ASP.NET Core API
   └── PostgreSQL
   ↓
Project ADR / Exception
```

Project thật tạo `project-profile.json` từ `PROJECT_PROFILE.example.json`. Toolchain sẽ kiểm tra stack có phù hợp project type và liệt kê toàn bộ standard cần áp dụng.

### Reusable Capability Packs

Các capability lặp lại như AUTH, User Profile, File Upload, Notification, Audit Log hoặc Common CRUD được đóng gói versioned trong `reusable-modules/`. Pack chỉ là upstream reusable baseline; sau import, file trong `docs/` của project mới là source of truth.

```text
Starter Core
   +
Capability Pack Library
   ↓ import / customize / three-way upgrade
Project-local Canonical Docs
```

Governance state nằm ở `.project-docs/packs.lock.json` + immutable base snapshots, không chèn provenance vào business frontmatter.


## Nguyên tắc cốt lõi

1. `PROJECT_BLUEPRINT.md` là inventory/bản đồ cấp cao.
2. `Module -> Feature` là xương sống chức năng.
3. Entity dùng stable code; relation dựa evidence, không dựa filename hoặc tên giống nhau.
4. Một business/technical fact có một source of truth.
5. Traceability dùng typed/direct path; không dùng generic 2-hop dễ kéo nhầm entity.
6. Project type + technology stack quyết định standard bắt buộc.
7. Thay đổi entity phải có impact analysis + stale dependency check.
8. Open Question blocking có thể chặn Definition of Ready.
9. Generated graph/site/report không phải source of truth.
10. Reusable pack không bao giờ là runtime source of truth của project; import xong project-local docs là canonical.
11. Pack upgrade luôn dùng base/upstream/local three-way review, không overwrite thẳng.

## Quick start

```bash
cp PROJECT_PROFILE.example.json project-profile.json
# chỉnh projectTypes + technologyStacks
cd tools
npm run profile:check
npm run pack:validate
npm run docs:all
npm run docs:serve
```

Sau đó đọc `START_HERE.md` và làm lần lượt workflow.

## Cấu trúc

```text
.
├── starter-kit.json
├── PROJECT_PROFILE.example.json
├── PROJECT_BLUEPRINT.md
├── START_HERE.md
├── .project-docs/              # pack lock/base/proposals
├── reusable-modules/           # versioned capability pack library
├── registry/
│   ├── entity-types.json
│   ├── relation-map.json
│   ├── frontmatter-schema.json
│   ├── project-types.json
│   ├── technology-stacks.json
│   ├── traceability-profiles.json
│   └── quality-rules.json
├── standards/
│   ├── project-types/
│   │   ├── web/
│   │   ├── mobile/
│   │   └── api/
│   └── stacks/
│       ├── web/reactjs/
│       ├── mobile/react-native/
│       ├── mobile/flutter/
│       ├── api/nodejs/
│       ├── api/dotnet-core/
│       └── database/postgresql/
├── templates/
├── prompts/
├── workflows/
├── docs/
├── tools/
└── site/                     # generated
```

## Tooling gates đã có

- Registry-enforced entity type/status.
- Frontmatter required fields.
- Typed relation source -> relation -> target + cardinality.
- Duplicate stable code/route/API contract.
- Over-link/high-degree warning.
- Data-driven quality rules theo project profile.
- Typed traceability; explicit `Feature -> Requirement -> Test` path.
- Dependency-hash stale detection.
- Blocking Open Question gate.
- Mermaid structural lint.
- Static site: Markdown, tables, code, Mermaid, search, Catalog, Capability Packs, Traceability, Diagram Gallery, interactive graph.
- Pack manifest validation + preview-first import.
- Pack lock/provenance + immutable import snapshot.
- Three-way `base/local/upstream` diff + upgrade proposal.
- Explicit pack review gate before implementation.

Chi tiết: `tools/README.md`.
