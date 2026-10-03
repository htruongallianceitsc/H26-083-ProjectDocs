# React Native Expo & Native Boundary

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Khai báo managed/prebuild/bare strategy.
- Config plugin/native module thay đổi phải document build impact.
- OTA update chỉ cho thay đổi tương thích binary/native runtime.
- EAS/build credentials ownership và rollback strategy phải rõ nếu dùng Expo.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
