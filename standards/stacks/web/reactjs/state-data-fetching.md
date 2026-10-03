# ReactJS State & Data Fetching

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Phân loại local UI state, URL state, server state, global app state.
- Server state dùng query cache có stale/retry/invalidation policy.
- Mutation phải xử lý optimistic update/rollback khi dùng.
- Abort stale request khi navigation/search thay đổi.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
