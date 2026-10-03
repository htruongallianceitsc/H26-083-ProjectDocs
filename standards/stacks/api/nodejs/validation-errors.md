# NodeJS Validation & Errors

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Schema validator thống nhất; business error có stable code.
- Map validation/business/infrastructure errors sang HTTP status có convention.
- Không dựa message text để client branch logic.
- Log internal context nhưng response không lộ secret.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
