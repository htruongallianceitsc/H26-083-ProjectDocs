# Documentation Toolchain

Zero-dependency NodeJS toolchain (Node 20+). `npm install` không bắt buộc vì package không có runtime dependency.

## Commands

```bash
cd tools
npm run profile:check
npm run docs:validate
npm run docs:sync
npm run docs:build
npm run docs:check-site
npm run docs:serve
```

Full pipeline:

```bash
npm run docs:all
```

## What is validated
- Entity `type/status` phải thuộc registry.
- Frontmatter required fields/date.
- Stable code uniqueness.
- Typed relation target + allowed source relation + cardinality.
- Broken relation.
- Duplicate route/API method+path.
- Over-link / high graph degree.
- Data-driven quality rules theo `project-profile.json`.
- Blocking Open Question gate.
- Mermaid structural lint.
- Dependency-hash stale warning.

## Sync outputs
`docs/_generated/` chứa catalog, graph, typed traceability và health report. Traceability không dùng generic untyped 2-hop; chỉ dùng direct/typed path và explicit `Feature -> Requirement -> Test`.

## Static site
`docs:build` render Markdown, table, code, Mermaid, Catalog, typed Traceability, Diagram Gallery, search và interactive typed graph.

Mermaid mặc định thử local vendor rồi CDN. Muốn offline hoàn toàn:

```bash
npm run docs:vendor
npm run docs:build
```

## Stale detection
`tools/.cache/dependency-state.json` lưu baseline hash. Nếu source A không đổi nhưng entity liên quan của A đổi, A được đánh dấu stale. Khi A được chỉnh/review lại, baseline dependency hash được cập nhật.

## Source of truth
Tools không tự sửa source Markdown. Generated outputs nằm ở `docs/_generated/`, `site/`, `tools/.cache/`.
