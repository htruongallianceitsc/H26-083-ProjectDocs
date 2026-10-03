# NodeJS API Architecture

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Route/controller mỏng; application/domain service chứa business orchestration.
- IO adapter cho DB/queue/external service.
- Không dùng module singleton mutable làm business state.
- Async boundary/error propagation phải có convention.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
