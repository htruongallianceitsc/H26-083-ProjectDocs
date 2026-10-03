# React Native State Management

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Phân loại screen/local, app-global, server-state, persisted/offline state.
- Không duplicate server state vào store nếu không có lý do.
- One-time effect/navigation/toast tách khỏi durable state.
- Persisted state phải version/migrate.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
