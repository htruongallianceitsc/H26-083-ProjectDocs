# ASP.NET Core DI & Configuration

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Service lifetime Singleton/Scoped/Transient phải phù hợp thread/request lifecycle.
- Không inject scoped vào singleton.
- Config từ environment/secret provider, không commit secret.
- HttpClientFactory cho outbound HTTP.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
