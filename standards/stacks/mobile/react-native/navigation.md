# React Native Navigation

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Typed route params; deep link config cùng canonical route.
- Nested/bottom navigation có ownership rõ và back behavior test.
- Auth/session restore không gây flash screen sai quyền.
- Push/deep link pending được resume sau login nếu hợp lệ.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
