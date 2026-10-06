# Mockup-Driven Documentation Standard — v5.10

## Purpose

Cho phép một project bắt đầu hoặc bổ sung tài liệu từ folder `mockups/` chứa ảnh UI mà vẫn giữ nguyên nguyên tắc Documentation-First: **mockup là evidence, không tự động trở thành business truth**.

## Source-of-truth boundary

| Nội dung | Source of truth |
|---|---|
| File ảnh, trạng thái visual tại thời điểm review | `mockups/` + hash trong runtime inventory |
| Screen purpose, states, actions, navigation | Screen document |
| Functional need / acceptance | Requirement |
| Business constraint | Business Rule |
| API contract | API document |
| Database contract | Database Object |
| Verification | Test Case / Test Script |

Một mockup có thể chứng minh **cái gì đang hiện trên UI**, nhưng không đủ bằng chứng để chứng minh backend contract, hidden validation, permission model hoặc business behaviour không nhìn thấy.

## Canonical folders

```text
project-root/
├── mockups/                       # project design evidence
├── docs/05-screens/              # canonical Screen specs
└── .project-docs/mockups/         # derived inventory/analysis/candidates/reports
    ├── analysis/
    └── proposals/
```

`mockups/` là project evidence root. `.project-docs/mockups/` là runtime/derived state và có thể rebuild; không chứa business truth duy nhất.

## Naming convention

Ưu tiên:

```text
<module>/<screen-key>__<state>__<variant>.<ext>
```

Ví dụ:

```text
mockups/auth/login__default.png
mockups/auth/login__validation-error.png
mockups/orders/order-list__empty__mobile.png
```

`state` nên dùng các tên rõ nghĩa như `default`, `loading`, `empty`, `error`, `validation-error`, `success`, `modal-open`, `permission-denied`.

## Required workflow

1. Inventory ảnh bằng `mockup:inventory`.
2. Sinh analysis tasks bằng `mockup:tasks`.
3. Vision-capable agent phân tích từng ảnh thành JSON evidence.
4. Build Screen candidates bằng `mockup:candidates`.
5. Human/agent review candidate; không auto-promote.
6. Promote:
   - Screen mới → tạo **draft Screen doc**.
   - Screen đã tồn tại → mặc định chỉ tạo **enrichment proposal**, không overwrite.
7. Hoàn thiện Feature/Requirement/Rule/Flow từ canonical evidence khác và open questions.
8. Chạy `mockup:report` + `mockup:check` để kiểm tra coverage/drift.
9. Tiếp tục Ready → WorkPlan → Implementation theo workflow chuẩn.

## Evidence rules

### Allowed from image

- visible labels/text
- visible sections/components
- form fields and obvious control types
- visible required indicator
- actions/buttons
- visible messages
- visible screen state
- navigation cues explicitly shown
- platform/viewport clues

### Not allowed from image alone

- API endpoint/payload
- DB table/column
- role/permission semantics not shown
- server-side validation
- hidden business rule
- hidden side effect
- non-visible edge case
- route without evidence

Unknowns must become `openQuestions` or `TBD`.

## Screen contract

Screen docs derived from mockups must contain:

- `mockup_refs` frontmatter
- Mockup Coverage table by image/state/hash
- Layout / Sections
- Fields
- Actions
- UI States
- Visible Validation & Messages
- Navigation evidence
- explicit Open Questions

A Screen is not considered mockup-reconciled when its referenced image hash changed after promotion.

## Multi-image grouping

Multiple images should map to one Screen when they represent states/variants of the same logical route/page. Do not create one Screen entity per screenshot unless they are genuinely different screens.

Examples:

```text
login__default.png
login__validation-error.png
login__loading.png
```

→ one `SCR-...-LOGIN` with three visual states.

## Review & promotion policy

- Vision analysis is mandatory before promotion by default.
- Candidate review is mandatory.
- Existing approved/implemented Screen docs are not auto-rewritten from image evidence.
- Mechanical application to an existing Screen may only add/reconcile evidence references; semantic behaviour changes must be reviewed in canonical docs.

## Drift policy

`mockup:check` must detect at least:

- mockup missing/stale vision analysis
- screen mockup not mapped to a canonical Screen
- broken `mockup_refs`
- mockup image changed after promotion
- accepted candidate not promoted/proposed

A changed image does not automatically mean the Screen spec is wrong, but it makes reconciliation mandatory.

## Relationship to Progressive Specification

Mockup-driven ingestion works with every Spec Level:

- **Lightweight**: mockup can quickly bootstrap Screen + Feature summary and open questions.
- **Standard/Full**: visible UI evidence must eventually trace into Requirements, Rules, Flows and Tests where applicable.

Do not generate Requirement/API/DB/Test entities merely because a mockup exists.
