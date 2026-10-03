# Documentation Tooling (NodeJS)

Toolchain này biến repository tài liệu thành một hệ thống có thể kiểm tra, đồng bộ index và xem trực quan trên web.

## Yêu cầu

- NodeJS >= 20
- Toolchain core không có dependency NPM bên ngoài. Chạy lần đầu:

```bash
cd tools
npm install
```

Không commit `tools/node_modules/`.

## Commands

### 1. Validate source docs

```bash
npm run docs:validate
```

Kiểm tra:

- frontmatter bắt buộc theo loại entity;
- placeholder còn sót trong source docs;
- code format và duplicate code;
- broken local Markdown link;
- broken relation trong `related`;
- duplicate screen route;
- duplicate API method + path;
- stale review date;
- orphan entity;
- feature thiếu requirement;
- requirement thiếu test;
- screen/API chưa trace về feature;
- Mermaid block có declaration bất thường.

Validator **không sửa source**. Có error thì exit code = 1 để dùng trong CI.

### 2. Sync documentation model

```bash
npm run docs:sync
```

Scan source docs và tạo lại:

```text
docs/_generated/
├── DOCUMENT_INDEX.md
├── TRACEABILITY_MATRIX.md
├── PROJECT_GRAPH.md
└── DOCUMENT_HEALTH.md

tools/.cache/
├── catalog.json
└── graph.json
```

Các file trên là derived output, không phải source of truth.

### 3. Build static website

```bash
npm run docs:build
```

Output: `../site/`

Website có:

- dashboard inventory/health;
- sidebar theo nhóm tài liệu;
- render Markdown;
- syntax highlighted code blocks;
- Mermaid flowchart/sequence/state/ERD/architecture diagrams;
- full-text search;
- metadata panel;
- backlinks/related documents;
- entity catalog;
- traceability matrix;
- interactive Cytoscape project graph;
- diagram gallery;
- dark/light mode.

Interactive project graph dùng SVG/JavaScript thuần, không cần thư viện ngoài. Mermaid mặc định render qua CDN; nếu cần môi trường offline, chạy `npm run docs:vendor` một lần để tải `tools/vendor/mermaid.min.js`. Builder sẽ tự ưu tiên bản local.

### 4. Serve static site

```bash
npm run docs:serve
```

Default: `http://127.0.0.1:4173`

Custom port:

```bash
node scripts/serve-site.mjs --port=8080
```

### 5. Development mode

```bash
npm run docs:dev
```

Watch Markdown source, tự sync + build lại khi thay đổi và đồng thời mở static server.

### 6. CI/full build

```bash
npm run docs:all
```

Equivalent:

```text
validate -> sync -> build
```

Nếu validation có error, pipeline dừng trước khi generate website.

## Source vs generated

```text
Source of truth
  *.md + docs/**/*.md + metadata related
          |
          v
      validate
          |
          v
        sync
       /    \
_generated   .cache
       \    /
          v
         build
          |
          v
         site/
```

Không edit trực tiếp `site/`, `docs/_generated/` hoặc `tools/.cache/`.


### 7. Vendor Mermaid for offline use

```bash
npm run docs:vendor
npm run docs:build
```

Nếu không vendor, HTML vẫn build bình thường; các Mermaid diagram cần truy cập CDN khi browser mở site. Các view còn lại (Markdown, search, catalog, traceability, interactive graph) hoàn toàn self-contained.


### 8. Check generated local links

```bash
npm run docs:check-site
```

Duyệt toàn bộ HTML đã build và fail nếu `href/src` nội bộ trỏ tới file không tồn tại. `docs:all` đã bao gồm bước này.

### 9. Clean derived output

```bash
npm run docs:clean
```

Xóa `site/`, `tools/.cache/`, `docs/_generated/`. Source Markdown không bị ảnh hưởng.
