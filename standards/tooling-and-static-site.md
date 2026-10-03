# Documentation Tooling & Static Site Standard

## 1. Canonical source

Markdown source và frontmatter là source of truth. Web pages, indexes, matrices, graphs và JSON caches đều phải có thể rebuild.

## 2. Validation gate

Mỗi pull request thay đổi tài liệu nên chạy:

```bash
cd tools
npm ci
npm run docs:validate
npm run docs:sync
npm run docs:build
```

Không merge khi có validation error. Warning cần review nhưng không bắt buộc block trừ khi team nâng rule thành error.

## 3. Generated artifact policy

- `docs/_generated/`: human-readable derived documentation.
- `tools/.cache/`: machine-readable derived model.
- `site/`: deployable static site.
- Không đặt business fact chỉ tồn tại trong generated output.

## 4. Diagram policy

Ưu tiên Mermaid trong Markdown để diagram version-control cùng tài liệu.

Supported view phổ biến:

- `flowchart` cho business/system flow;
- `sequenceDiagram` cho interaction/API flow;
- `stateDiagram-v2` cho lifecycle/UI state;
- `erDiagram` cho logical data relationship;
- `classDiagram` cho domain/component relation;
- `mindmap` cho discovery/context map;
- `timeline` cho migration/release history;
- interactive graph được sinh từ metadata `related`, không viết tay.

## 5. Traceability

Graph/traceability phải sinh từ stable entity code và metadata relationship. Không suy luận relationship chỉ từ filename hoặc text similarity.

## 6. Static hosting

`site/` chỉ gồm static HTML/CSS/JS/JSON/assets, có thể host trên GitHub Pages, GitLab Pages, Azure Static Web Apps, S3/CloudFront, Nginx hoặc bất kỳ static web server nào.
