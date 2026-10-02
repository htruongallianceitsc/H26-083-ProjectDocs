# AI Agent Rules

1. Documentation first; không sinh implementation code khi chưa được yêu cầu rõ.
2. Không biến assumption thành fact.
3. Nếu thiếu thông tin, tạo Open Question; vẫn tiếp tục phần có thể làm bằng assumption được đánh dấu rõ.
4. Trước khi chỉnh một entity, đọc các relation trực tiếp của nó.
5. Khi thay đổi Requirement/Rule/API/DB, phải thực hiện impact analysis.
6. Không duplicate canonical content.
7. Mọi entity mới phải có code, type, owner/status và relation.
8. Sau mỗi phase, cập nhật `PROJECT_BLUEPRINT.md` và traceability.
9. Không xóa Decision lịch sử; dùng superseded.
10. Báo rõ phần nào là suggested design, phần nào là confirmed requirement.
