# ASP.NET Core Testing, Observability & Deployment

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Unit/application/integration với WebApplicationFactory khi phù hợp.
- OpenTelemetry/structured logs + TraceId correlation.
- Health checks phân readiness/liveness khi cần.
- Publish artifact/runtime/container version pinned và rollback tested.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
