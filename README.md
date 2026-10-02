# Production Web Project Documentation Starter Kit

Bộ khung này dành cho project web theo hướng **documentation-first**. Mục tiêu là tạo đủ tài liệu để một team mới hoặc AI Agent có thể hiểu project, đánh giá impact, phát triển feature và vận hành production lâu dài mà không phụ thuộc vào kiến thức truyền miệng.

## Nguyên tắc cốt lõi

1. `PROJECT_BLUEPRINT.md` là bản đồ cấp cao của toàn project.
2. `Module -> Feature` là xương sống chức năng.
3. Mỗi entity có một mã ổn định: Module, Feature, Requirement, Business Rule, Screen, API, DB Object, Test, Decision...
4. Một thông tin chỉ có **một source of truth**; tài liệu khác tham chiếu bằng code/link thay vì copy lại.
5. Mọi Feature phải trace được tối thiểu: `Feature -> Requirement/Rule -> Screen/API/DB -> Test`.
6. Thay đổi một entity phải có impact analysis và kiểm tra tài liệu liên quan có bị stale không.
7. Bộ tài liệu này chỉ quản lý tài liệu. Không sinh code ứng dụng trừ khi project về sau chủ động mở phase implementation.

## Cách bắt đầu nhanh

1. Đọc `START_HERE.md`.
2. Đi lần lượt qua `workflows/01` đến `workflows/07`.
3. Dùng prompt trong `prompts/` tương ứng với từng phase.
4. Dùng template trong `templates/` để tạo tài liệu thật.
5. Cập nhật `PROJECT_BLUEPRINT.md` sau mỗi batch tài liệu.
6. Chạy checklist trong `workflows/END_TO_END_CHECKLIST.md` trước khi coi bộ tài liệu là đủ.
7. Xem `examples/mini-project/` để thấy một feature mẫu được trace xuyên suốt.

## Cấu trúc chính

```text
.
├── START_HERE.md
├── PROJECT_BLUEPRINT.md
├── DOCS_GOVERNANCE.md
├── registry/
├── standards/
├── workflows/
├── prompts/
├── templates/
├── docs/
│   ├── 00-project/
│   ├── 01-product/
│   ├── 02-modules/
│   ├── 03-requirements/
│   ├── 04-business-rules/
│   ├── 05-screens/
│   ├── 06-flows/
│   ├── 07-api/
│   ├── 08-database/
│   ├── 09-architecture/
│   ├── 10-security/
│   ├── 11-quality/
│   ├── 12-devops/
│   ├── 13-operations/
│   ├── 14-performance/
│   ├── 15-decisions/
│   ├── 16-release/
│   ├── 17-traceability/
│   ├── 18-changelog/
│   └── 19-open-items/
└── examples/mini-project/
```

## Khi nào tài liệu được coi là sẵn sàng cho implementation?

Tối thiểu phải có:

- Project scope rõ.
- Module và Feature inventory đầy đủ.
- Requirement + Business Rule cho feature cần làm.
- Screen/Flow nếu có UI.
- API contract nếu có backend interaction.
- DB impact nếu có persistence.
- Permission/Security/NFR liên quan.
- Acceptance Criteria và Test Case.
- Không còn open question blocking.
- Traceability không bị đứt.

Chi tiết xem `standards/definition-of-ready-done.md`.
