# ASP.NET Core API Conventions

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- ProblemDetails/error envelope ổn định.
- Model validation + business validation tách biệt.
- Versioning/deprecation rõ; OpenAPI generated/reviewed.
- Authorization policy-based cho permission phức tạp.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
