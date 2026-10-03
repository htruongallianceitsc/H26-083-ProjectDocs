# PostgreSQL Schema Conventions

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Naming/schema/PK/FK/audit/soft-delete convention thống nhất.
- Constraint ở DB cho invariant dữ liệu quan trọng.
- Index gắn query pattern, không tạo theo cảm tính.
- TIMESTAMPTZ ưu tiên cho timestamp production đa timezone.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
