# ASP.NET Core Data Access

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- EF Core query projection/AsNoTracking khi read-only phù hợp.
- Không lazy-load gây N+1 không kiểm soát.
- Transaction cho atomic multi-write.
- Migration backward-compatible với rolling deploy.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
