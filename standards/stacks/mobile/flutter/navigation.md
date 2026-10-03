# Flutter Navigation

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Router tập trung, typed route/params/query.
- Auth/permission guard ở routing layer.
- Nested/bottom nav, back stack, unknown route và restore route được document.
- Deep link/push route dùng cùng canonical mapping.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
