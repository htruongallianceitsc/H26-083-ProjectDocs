# PostgreSQL Migration & Operations

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Migration tránh long lock; large backfill tách batch.
- Expand/contract cho breaking schema change.
- Backup/restore/PITR test theo RPO/RTO.
- Role production theo least privilege và audit.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
