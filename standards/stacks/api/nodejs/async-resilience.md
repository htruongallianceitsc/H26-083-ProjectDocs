# NodeJS Async & Resilience

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Không block event loop bằng CPU work/file transform lớn; offload worker/job.
- Outbound retry có idempotency/backoff/jitter.
- Queue consumer ack/retry/dead-letter explicit.
- Graceful shutdown đóng listener, drain request và connection pool.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
