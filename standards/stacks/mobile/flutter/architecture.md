# Flutter Architecture

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Feature-first, presentation/domain/data separation.
- Repository là boundary cho API/cache/storage.
- Widget không gọi API trực tiếp và không chứa business rule.
- Platform channel/plugin được bọc qua service/adaptor.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
