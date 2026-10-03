# ReactJS Forms

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Schema validation dùng chung với DTO khi khả thi.
- Client validation không thay server validation.
- Map field/server/business errors nhất quán.
- Prevent double submit và preserve/recover input theo policy.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
