# NodeJS API Coding Standard

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- TypeScript strict khuyến nghị.
- Không swallow Promise rejection; await/catch ở boundary phù hợp.
- Input DTO/schema validation trước business logic.
- Lint/typecheck/test là CI gate.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
