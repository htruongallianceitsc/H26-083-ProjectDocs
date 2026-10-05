# NodeJS HTTP Contract

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Framework Express/Fastify/Nest phải có centralized auth/error/validation.
- Không trả stack trace production.
- Request size, timeout, pagination max và rate limit có config.
- Correlation id propagate outbound calls.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
