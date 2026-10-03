# PostgreSQL Query Performance

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- pg_stat_statements theo dõi total_exec_time/mean/calls/rows.
- EXPLAIN ANALYZE dùng trên môi trường an toàn và dữ liệu đại diện.
- Review sequential scan lớn, N+1, missing/unused index và bloat.
- Connection pool/query timeout có budget.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
