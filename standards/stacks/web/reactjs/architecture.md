# ReactJS Architecture

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Feature-first hoặc domain-first structure nhất quán.
- Component chỉ orchestration UI; business rule ở use-case/service phù hợp.
- API client, query/cache layer và auth boundary dùng chung.
- Không tạo global state cho server data nếu query cache đã quản lý.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
