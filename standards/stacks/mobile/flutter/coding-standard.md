# Flutter Coding Standard

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Dart analyzer/lints là CI gate; ưu tiên const/final/immutable.
- Naming/file/import/barrel export nhất quán.
- Widget/function nhỏ; tách khi rebuild scope hoặc complexity cao.
- Null-safety, deprecated/dead code và TODO/FIXME được quản lý.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
