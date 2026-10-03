# Production Project Documentation Starter Kit

Bộ khung **documentation-first** cho project production có thể gồm Web, Mobile, API/Backend hoặc nhiều surface cùng lúc. Mục tiêu là để PM/BA/UX/Dev/QA/Ops và AI Agent cùng dùng một source of truth có traceability, quality gate và static documentation portal.

## Điểm mới: standards theo profile

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

## Quick start

```bash
cp PROJECT_PROFILE.example.json project-profile.json
# chỉnh projectTypes + technologyStacks
cd tools
npm run profile:check
npm run docs:all
npm run docs:serve
```

Sau đó đọc `START_HERE.md` và làm lần lượt workflow.

## Cấu trúc

```text
.
├── PROJECT_PROFILE.example.json
├── PROJECT_BLUEPRINT.md
├── START_HERE.md
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
- Static site: Markdown, tables, code, Mermaid, search, Catalog, Traceability, Diagram Gallery, interactive graph.

Chi tiết: `tools/README.md`.
