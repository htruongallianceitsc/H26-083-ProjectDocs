# React Native Architecture

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Feature-first modules với presentation/domain/data/native boundary.
- React Navigation/Expo Router chỉ chịu route orchestration, không chứa business rule.
- Native capability bọc qua adapter/interface để mock.
- Repository chịu cache/network strategy; screen không gọi fetch trực tiếp.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
