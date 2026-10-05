# Workflow 09 — Project Profile & Standards Selection

## Goal
Chọn đúng standard trước khi tạo technical documents.

## Steps
1. Copy `kit/examples/project-profile.example.json` thành `project-profile.json`.
2. Chọn `projectTypes`: web / mobile / api; một product có thể có nhiều loại.
3. Chọn `technologyStacks` đúng implementation thật.
4. Chạy `cd tools && npm run profile:check`.
5. Đọc các standard mà output liệt kê theo thứ tự Core -> Project Type -> Stack -> ADR.
6. Ghi link standards vào architecture/blueprint; không copy nội dung standards vào từng feature.
7. Nếu project cố ý khác standard, tạo ADR.

## Exit Criteria
- Profile hợp lệ.
- Không stack nào thiếu project type cha.
- Architecture docs đã reference applicable standards.
- Team biết standard nào là mandatory vs project-specific exception.
