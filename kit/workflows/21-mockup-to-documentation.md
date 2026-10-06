# Workflow 21 — Mockups → Documentation

Use khi project có folder `mockups/` chứa UI screenshots/wireframes/design exports và cần sinh hoặc kiểm tra documentation dựa trên chúng.

## Goal

```text
mockups/*
   ↓ inventory + hash
Vision Analysis
   ↓
Screen Candidates
   ↓ review
Draft Screen / Enrichment Proposal
   ↓
Feature + Requirement + Rule + Flow reconciliation
   ↓
API/DB/Test contracts only when separately evidenced
   ↓
Mockup Traceability Check
   ↓
Ready Gate / WorkPlan
```

## Step 1 — Add mockups

Đặt file vào `mockups/` và ưu tiên naming:

```text
mockups/<module>/<screen-key>__<state>__<variant>.png
```

## Step 2 — Build deterministic inventory

```bash
cd tools
npm run mockup:inventory
npm run mockup:tasks
```

Outputs:

- `.project-docs/mockups/inventory.json`
- `.project-docs/mockups/analysis-tasks.json`

Inventory chỉ đọc file metadata/hash; nó không giả vờ hiểu nội dung UI.

## Step 3 — Vision analysis

Dùng `kit/prompts/46-mockup-to-documentation.md` cho các task còn thiếu.

Mỗi ảnh tạo structured analysis dưới:

```text
.project-docs/mockups/analysis/<asset-id>.json
```

Bất kỳ API/DB/rule/permission không nhìn thấy rõ phải để `TBD`/`openQuestions`.

## Step 4 — Build candidates

```bash
npm run mockup:candidates
npm run mockup:status
```

Tool group nhiều images thành một Screen candidate theo `screenKey` + state/variant.

## Step 5 — Review

```bash
npm run mockup:review -- --candidate MCKC-SCR-... --decision accepted --reviewer "Reviewer"
```

Reject candidate nếu grouping sai hoặc asset không nên tạo Screen.

## Step 6 — Promote

### New Screen

```bash
npm run mockup:promote -- --candidate MCKC-SCR-... --reviewer "Reviewer"
```

Tạo draft Screen dưới `docs/05-screens/` với `mockup_refs`, state coverage và open questions.

### Existing Screen

Mặc định promote chỉ tạo proposal dưới `.project-docs/mockups/proposals/`; canonical Screen không bị overwrite.

Sau khi review proposal, nếu chỉ cần reconcile mechanical evidence refs:

```bash
npm run mockup:promote -- --candidate MCKC-SCR-... --reviewer "Reviewer" --apply-existing
```

Semantic behaviour vẫn phải update ở canonical Feature/Requirement/Rule/Flow docs theo workflow bình thường.

## Step 7 — Complete functional documentation

Chạy review bằng `kit/prompts/47-mockup-functional-coverage.md` để tạo coverage plan Mockup → Screen → Feature → Requirement/Rule/Flow → Test. Sau đó từ Screen evidence, tiếp tục:

1. Xác định Feature sở hữu Screen.
2. Viết/đối chiếu Requirement.
3. Tách Business Rule chỉ khi rule đã được xác nhận.
4. Tạo Flow cho navigation/process nhiều bước.
5. Ghi Open Questions cho phần mockup không đủ bằng chứng.
6. Chỉ tạo API/DB contract khi có technical evidence hoặc quyết định rõ.
7. Sinh Test Cases từ Requirement/AC, không sinh từ pixel/layout đơn thuần.

## Step 8 — Traceability & drift

```bash
npm run mockup:report
npm run mockup:check
```

Generated report:

```text
docs/_generated/MOCKUP_TRACEABILITY.md
```

`mockup:check` fail mặc định nếu screen mockup chưa được analysis/map, reference gãy hoặc mockup đổi sau promotion.

## Exit Gate

- Mỗi screen mockup được map tới Screen canonical hoặc classified/reviewed là non-screen/reference.
- Mỗi Screen tạo từ mockup có explicit state coverage.
- Không có API/DB/business rule nào được bịa từ visual evidence.
- Mọi gap quan trọng đã trở thành Open Question hoặc canonical Requirement/Rule/Flow update.
- `npm run mockup:check` pass trước Ready Gate nếu project đang dùng mockups.
