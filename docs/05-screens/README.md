# screens

Thư mục source-of-truth cho nhóm tài liệu **screens**. Tài liệu entity thực tế trong thư mục này phải dùng frontmatter theo `kit/standards/metadata-schema.md` và code ổn định theo `kit/standards/naming-and-id-convention.md`.

> Không sửa các file trong `docs/_generated/`; chúng được tạo lại bằng `npm run docs:sync` trong thư mục `tools/`.


## Optional Screen-first review

Khi cần rà soát UI contract theo từng Screen, dùng `npm run wireframe:start` + `npm run wireframe:build` trong `tools/`. HTML/ASCII/text wireframes sinh ra chỉ là projection; mọi bổ sung về field/action/state/navigation phải quay lại Screen/Feature/Requirement/Flow canonical rồi rebuild.
