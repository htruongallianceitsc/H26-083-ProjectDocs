# ASP.NET Core Architecture

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Controller/endpoint mỏng; application service/use case chứa orchestration.
- Domain/business không phụ thuộc HttpContext.
- Infrastructure qua interface/DI; không service locator.
- CancellationToken propagate qua I/O path.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
