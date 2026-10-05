# Flutter State Management

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- BLoC/Cubit là chuẩn mặc định của profile này.
- Cubit cho state transition đơn giản; Bloc khi event/concurrency/flow phức tạp cần explicit event.
- State immutable và model Initial/Loading/Refreshing/Success/Empty/Error phù hợp.
- One-time UI event/side effect không lưu như durable state.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
