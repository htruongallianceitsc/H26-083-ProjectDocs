# ASP.NET Core Background Services

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- HostedService/BackgroundService chịu cancellation và graceful shutdown.
- Không giữ DbContext scoped lâu dài; tạo scope mỗi work item.
- Job idempotent, retry/dead-letter khi dùng queue.
- Health/metrics cho worker backlog/failure.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
