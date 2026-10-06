# Prompt 47 — Mockup Functional Coverage Review

```text
Mục tiêu: sau khi mockup vision analysis và Screen candidates đã được review, xác định bộ tài liệu functional tối thiểu cần có để project thực sự "đáp ứng mockups" thay vì chỉ có Screen description.

INPUT:
- `.project-docs/mockups/candidates.json`
- `.project-docs/mockups/analysis/*.json`
- canonical docs hiện có dưới `docs/`
- `PROJECT_BLUEPRINT.md`
- effective Spec Level của Feature/project

PROCESS:
1. Với mỗi Screen candidate accepted/promoted, xác định Feature owner hiện có.
2. Nếu chưa có Feature owner:
   - đề xuất Lightweight Feature draft theo user goal quan sát được;
   - nếu user goal không đủ rõ, tạo Open Question thay vì bịa Feature intent.
3. Đối chiếu visible actions/fields/messages/states với Requirements hiện có.
4. Chỉ đề xuất Requirement draft cho hành vi người dùng/hệ thống nhìn thấy và testable được từ evidence + context.
5. Chỉ tạo Business Rule khi điều kiện/ràng buộc được nói rõ trong mockup hoặc nguồn canonical khác.
6. Nếu nhiều Screens cho thấy một journey/navigation sequence, đề xuất Flow doc.
7. Test Case chỉ sinh sau khi Requirement/Acceptance Criteria đã được review; mockup có thể là visual evidence cho expected UI state nhưng không thay thế AC.
8. Không sinh API/DB contract từ UI mockup. Chỉ tạo Open Question/technical gap nếu backend contract chưa có.
9. Reuse canonical entities hiện có; không tạo entity mới chỉ để lấp checklist.

OUTPUT:
- bảng coverage cho từng mockup/screen:
  Mockup → Screen → Feature → Requirement/AC → Rule/Flow → Test
- danh sách canonical docs cần create/update
- Open Questions cho các phần không đủ evidence
- thứ tự authoring đề xuất
- không implementation code

QUALITY RULE:
Một mockup chỉ được coi là functional-covered khi Screen có Feature owner và các visible behaviours quan trọng đã được Requirement/Flow/Rule bao phủ hoặc được ghi rõ là Open Question/TBD có owner.
```
