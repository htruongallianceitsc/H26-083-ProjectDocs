# Workflow 03 — Blueprint -> Functional Documentation

Thực hiện theo từng Feature, ưu tiên P0/P1.

## Steps cho mỗi Feature
1. Tạo Feature doc.
2. Tách Functional Requirements.
3. Tách Business Rules.
4. Xác định Actors/Permissions.
5. Tạo Screen docs và Route nếu có UI. Nếu project có `mockups/`, chạy Workflow 21 trước/đồng thời để map visual evidence → Screen/state thay vì thiết kế Screen từ trí nhớ.
6. Tạo user/business/system flow.
7. Ghi Edge Cases và Open Questions.
8. Cập nhật Blueprint.

## Exit Gate
Feature phải đủ rõ để một engineer có thể bắt đầu thiết kế technical contract mà không đoán business behaviour.

> V4 prerequisite: run `03A-reuse-capability-detection.md` before generating repeated capabilities from scratch.
