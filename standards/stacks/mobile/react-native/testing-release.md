# React Native Testing & Release

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Test AppState/background/resume/process restart/network transition.
- Matrix tối thiểu iOS current/previous + Android API/device tiers theo audience.
- Upload sourcemap/dSYM/symbol artifacts.
- Release verify deep link, push, permission, store metadata và old-client API compatibility.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
