# Workflow 07 — Change Management

## Khi có yêu cầu thay đổi

1. Capture change request + reason.
2. Xác định entity canonical cần đổi.
3. Trace incoming/outgoing relations.
4. Phân tích potential impact.
5. Update docs canonical.
6. Reconcile Screen/API/DB/Test/Runbook liên quan.
7. Tạo ADR nếu decision đáng kể.
8. Update Blueprint/Traceability/Changelog.
9. Review Ready gate trước implementation.
10. Sau release, review Done gate.

## Không làm

- Sửa feature rồi quên test.
- Sửa API path nhưng Blueprint vẫn cũ.
- Rewrite ADR cũ để hợp lý hóa quyết định mới.
- Copy cùng rule vào nhiều file.
