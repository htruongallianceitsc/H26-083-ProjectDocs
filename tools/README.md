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

## Capability Pack commands (v3)

```bash
# validate every pack in reusable-modules/
npm run pack:validate

# validate one pack
npm run pack:validate -- ../reusable-modules/auth-standard

# preview import (no project docs changed)
npm run pack:import -- ../reusable-modules/auth-standard

# apply import
npm run pack:import -- ../reusable-modules/auth-standard -- \
  --apply \
  --features register,google-login \
  --set LOGIN_IDENTIFIER=email \
  --set SESSION_STRATEGY=http_only_cookie

# inspect/approve imported assumptions
npm run pack:review -- auth-standard
npm run pack:review -- auth-standard --approve --note "Reviewed by Product + Tech Lead"

# compare with new upstream version
npm run pack:diff -- auth-standard --source ../path/to/auth-standard-new

# create three-way upgrade proposal only
npm run pack:upgrade -- auth-standard --source ../path/to/auth-standard-new

# apply only safe upstream changes
npm run pack:upgrade -- auth-standard --source ../path/to/auth-standard-new --apply
```

### Import options

- `--features a,b`: enable exactly these optional features in addition to required features.
- `--exclude-features a,b`: disable optional features.
- `--set KEY=value`: override a manifest variable.
- `--namespace INTERNAL`: deterministic stable-code remap, e.g. `FEAT-AUTH-LOGIN -> FEAT-INTERNAL-AUTH-LOGIN`.
- `--target-root docs/...`: override destination root.
- `--accept-defaults`: explicit approval shortcut at import; otherwise pack review remains pending.

### Governance files

- `.project-docs/packs.lock.json` — canonical pack provenance/version/selection/code map.
- `.project-docs/pack-snapshots/` — immutable rendered base used by three-way diff.
- `.project-docs/pack-proposals/` — generated upgrade reports/upstream candidates.

Pack metadata is not business documentation. Imported Markdown inside `docs/` becomes the project-local source of truth.

### Upgrade conflict policy

`pack:upgrade` never overwrites conflicts automatically. Safe `upstream-only`/`added` changes can be applied with `--apply`. Upstream deletion always requires manual review. If a conflict has been semantically merged into the local project file, `--accept-local-merge` may be used only as an explicit acknowledgement after review.
