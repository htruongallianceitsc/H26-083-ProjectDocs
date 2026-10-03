# Documentation Governance

## 1. Source of Truth

Mỗi thông tin có đúng một nơi canonical:

- Feature behaviour -> Feature / Requirement / Business Rule.
- UI contract -> Screen.
- HTTP contract -> API.
- Persistence schema/rules -> Database Object.
- Cross-cutting technical choices -> Architecture / ADR.
- Test expectation -> Test Case.
- Production operation -> Runbook / Operations.

Tài liệu khác chỉ reference bằng code/link.

## 2. Required Metadata

Mọi entity document nên có metadata block với tối thiểu:

```yaml
---
code: FEAT-XXX-001
type: feature
title: Example
status: draft
owner: Team/Person
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
related: {}
---
```

## 3. Lifecycle

Khuyến nghị: `draft -> review -> approved -> implemented -> deprecated`.

Decision dùng: `proposed -> accepted/rejected -> superseded`.

## 4. Review Rules

- Requirement/Rule: review bởi Product/BA.
- Screen/Flow: review bởi Product + UX/UI + Dev nếu có technical constraint.
- API/DB/Architecture: review bởi Tech Lead/Backend/DB owner.
- Security/NFR/Runbook: review bởi owner tương ứng.
- Traceability audit trước release hoặc milestone lớn.

## 5. Change Rules

Khi thay đổi entity:

1. Xác định entity canonical.
2. Ghi reason/change request.
3. Phân tích impact.
4. Cập nhật entity canonical.
5. Cập nhật các tài liệu bị ảnh hưởng.
6. Cập nhật Blueprint nếu inventory/summary thay đổi.
7. Cập nhật traceability.
8. Review lại tests và production docs nếu hành vi runtime thay đổi.

## 6. Không xóa lịch sử quyết định

ADR/Decision cũ không bị rewrite để trông như quyết định mới luôn tồn tại. Tạo quyết định mới và đánh dấu quyết định cũ là `superseded`.

## 7. Automated Documentation Gate

Sau mỗi batch thay đổi tài liệu:

```bash
cd tools
npm run docs:all
```

Pipeline phải đảm bảo:

- validation không có error;
- generated catalog/traceability/graph được rebuild;
- static site build thành công;
- generated HTML không có broken local link.

## 8. Derived Artifacts

Các thư mục sau không phải source of truth:

- `docs/_generated/`
- `tools/.cache/`
- `site/`

Có thể xóa và tạo lại bằng toolchain. Không ghi business fact chỉ tồn tại trong các file generated.


## 9. Standard Precedence

`Core governance -> Project Type -> Technology Stack -> Project ADR`.

ADR là cách duy nhất để cố ý khác standard. Stack standard không được vô hiệu hóa security/reliability requirement của project-type standard chỉ bằng implementation convenience.

## 10. Machine-readable Lifecycle & Blocking Questions

Entity type/status lấy từ `registry/entity-types.json`. Open Question dùng entity `open-question` với `blocking: true/false`; khi project profile bật `blockOnOpenQuestions`, Open Question trạng thái `open` và blocking làm validation fail.

## 11. Typed Relation & Traceability

Relation được kiểm qua `registry/relation-map.json`; target type và cardinality phải hợp lệ. Traceability matrix chỉ dùng direct typed relations và path được cấu hình trong `registry/traceability-profiles.json`, không dùng traversal gần-neighbor chung.

## 12. Documentation Freshness

Toolchain lưu dependency baseline hash trong `tools/.cache/dependency-state.json`. Nếu tài liệu không đổi nhưng source liên quan thay đổi, tài liệu được cảnh báo stale cho tới khi được review/update lại.
