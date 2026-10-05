# Project Documentation Source

`docs/` chứa tài liệu canonical của project. Các file Markdown ở đây là source of truth; `.project-docs/site/` và `docs/_generated/` là output có thể build lại.

## Quy trình

1. Tạo/update tài liệu bằng template.
2. `cd tools && npm run docs:validate`.
3. `npm run docs:sync` để tạo catalog, graph và traceability.
4. `npm run docs:build` để sinh static website.
5. `npm run docs:serve` hoặc `npm run docs:dev` để xem giao diện web.
## Version history

`docs/history/` stores starter-kit upgrade notes, QA reports and historical transition reviews. Keep these records searchable here instead of placing chronological release artifacts at repository root.



## Applications (v5.4)

`24-applications/` contains canonical deployable application boundaries such as APP-WEB, APP-API and APP-MOBILE. Features may link them through `related.applications`.

## Local knowledge/runtime indexes (v5.5)

Canonical docs stay here. Search, graph and source indexes are generated under `.project-docs/indexes/` and can be rebuilt with `npm run knowledge:reindex` and `npm run source:scan`.

