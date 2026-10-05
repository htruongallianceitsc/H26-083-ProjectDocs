# Prompt 18 — Change Impact Analysis

```text
Có change request sau: <CHANGE_REQUEST>

Hãy:
1. Xác định canonical entity chịu thay đổi.
2. Trace related entities trực tiếp.
3. Phân tích potential impact theo các nhóm Business/UI/API/DB/Test/Security/Ops.
4. Phân loại Must Update / Review Needed / Probably Unaffected.
5. Chỉ ra regression tests cần xem lại.
6. Chỉ ra Blueprint/ADR/Runbook/Release docs có cần cập nhật không.
7. Tạo checklist update docs trước implementation.

Không kết luận runtime impact nếu chỉ có quan hệ tài liệu mà chưa có evidence kỹ thuật.
```
