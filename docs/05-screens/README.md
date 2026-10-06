# screens

Thư mục source-of-truth cho nhóm tài liệu **screens**. Tài liệu entity thực tế trong thư mục này phải dùng frontmatter theo `kit/standards/metadata-schema.md` và code ổn định theo `kit/standards/naming-and-id-convention.md`.

> Không sửa các file trong `docs/_generated/`; chúng được tạo lại bằng `npm run docs:sync` trong thư mục `tools/`.


## Optional Screen-first review

Khi cần rà soát UI contract theo từng Screen, dùng `npm run wireframe:start` + `npm run wireframe:build` trong `tools/`. HTML/ASCII/text wireframes sinh ra chỉ là projection; mọi bổ sung về field/action/state/navigation phải quay lại Screen/Feature/Requirement/Flow canonical rồi rebuild.
## v5.12 lifecycle/system behaviour

A Screen contract is not limited to visible controls. Use separate sections for **User Actions**, **Lifecycle Actions**, **System Actions** and **API Interactions**. This is especially important for Splash/App Bootstrap, auto-refresh, redirect and background-driven screens. If review reveals missing canonical Feature/Requirement/Flow/API/Test coverage, record a wireframe gap and use the authoring-gated promotion flow rather than editing generated HTML.


## v5.14 shared UI ownership

Use `docs/05-screens/shared/components/` for canonical `ui-component` entities and `docs/05-screens/shared/shells/` for `screen-shell` entities. A Screen should reference common chrome rather than copy it. The Screen owns local content/behaviour and slot overrides; the shared component owns reusable structure; the shell owns reusable placement.
