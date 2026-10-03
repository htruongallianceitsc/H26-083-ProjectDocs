# NodeJS Testing & Observability

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Unit/application test + API integration + contract test.
- Structured logger; AsyncLocalStorage hoặc equivalent cho trace context khi phù hợp.
- Metrics event-loop lag, memory, latency, error, DB pool.
- Load test endpoint critical.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
