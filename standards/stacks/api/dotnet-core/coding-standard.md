# ASP.NET Core Coding Standard

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Nullable reference types bật cho code mới.
- Async all the way cho I/O; tránh .Result/.Wait.
- Options pattern cho config typed; validation startup.
- Analyzer/format/test là CI gate.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
