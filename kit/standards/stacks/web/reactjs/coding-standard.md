# ReactJS Coding Standard

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- TypeScript strict khuyến nghị cho production.
- Component nhỏ, predictable props; tránh side effect trong render.
- Hook custom cho reusable behavior; không tạo hook chỉ để đổi tên một call.
- ESLint/format/typecheck là CI gate.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
