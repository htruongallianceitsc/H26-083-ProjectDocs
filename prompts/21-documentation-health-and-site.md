# Prompt 21 — Documentation Health & Static Site Review

Bạn đang review một documentation-first software project.

Hãy thực hiện theo thứ tự:

1. Đọc `PROJECT_BLUEPRINT.md`, `DOCS_GOVERNANCE.md`, `standards/` và `tools/docs.config.json`.
2. Chạy validation trong `tools/`.
3. Với mỗi error/warning, phân loại:
   - metadata;
   - broken relation;
   - missing traceability;
   - stale documentation;
   - duplicate identity/route/API;
   - broken link;
   - diagram issue.
4. Không tự sửa business fact nếu không có evidence.
5. Sau khi source hợp lệ, chạy sync và build static site.
6. Review các view:
   - Dashboard;
   - Catalog;
   - Traceability Matrix;
   - Interactive Graph;
   - Diagram Gallery.
7. Báo cáo:
   - coverage gap;
   - orphan entity;
   - feature chưa đủ requirement/test/API/UI/DB linkage;
   - documents cần review;
   - diagram/flow còn thiếu;
   - các thay đổi source được đề xuất.
8. Chỉ sửa source docs. Không chỉnh trực tiếp `site/`, `docs/_generated/`, `tools/.cache/`.
