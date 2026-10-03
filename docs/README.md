# Project Documentation Source

`docs/` chứa tài liệu canonical của project. Các file Markdown ở đây là source of truth; `site/` và `docs/_generated/` là output có thể build lại.

## Quy trình

1. Tạo/update tài liệu bằng template.
2. `cd tools && npm run docs:validate`.
3. `npm run docs:sync` để tạo catalog, graph và traceability.
4. `npm run docs:build` để sinh static website.
5. `npm run docs:serve` hoặc `npm run docs:dev` để xem giao diện web.
