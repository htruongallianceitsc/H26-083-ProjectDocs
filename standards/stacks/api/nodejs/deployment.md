# NodeJS Deployment

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Pinned Node LTS/runtime, lockfile và reproducible build.
- Health/readiness, graceful shutdown, no local-disk dependency nếu multi-instance.
- Env secrets qua secret store.
- Process manager/container restart policy rõ.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
