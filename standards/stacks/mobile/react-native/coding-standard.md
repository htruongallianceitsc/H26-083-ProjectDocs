# React Native Coding Standard

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- TypeScript strict, naming/import/lint thống nhất.
- Không tạo inline heavy object/function trong list hot path khi gây re-render.
- Cleanup listener/subscription/AppState/NetInfo khi unmount.
- Không block JS thread bằng parse/transform file lớn.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
