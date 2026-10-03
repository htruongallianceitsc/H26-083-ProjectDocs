# ASP.NET Core Security

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Authentication scheme và authorization policy documented.
- Data Protection/key persistence phù hợp multi-instance.
- Rate limiting/antiforgery áp dụng theo surface.
- Sensitive logging masking và audit action.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
