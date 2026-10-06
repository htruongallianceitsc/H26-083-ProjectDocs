# Prompt 46 — Mockup → Documentation Evidence

```text
Mục tiêu: đọc các ảnh trong `mockups/` như DESIGN EVIDENCE và tạo structured analysis để sau đó sinh/reconcile Screen documentation.

BẮT BUỘC:
1. Chạy `cd tools && npm run mockup:inventory` và `npm run mockup:tasks` trước.
2. Chỉ xử lý các asset có trong `.project-docs/mockups/analysis-tasks.json`.
3. Với mỗi asset, dùng khả năng vision để quan sát trực tiếp hình ảnh và tạo 1 JSON analysis dưới `.project-docs/mockups/analysis/` theo `kit/registry/mockup-analysis.schema.json`.
4. `assetPath` và `imageHash` phải khớp inventory hiện tại.
5. Group các ảnh cùng một Screen bằng `screenKey`; dùng `state`/`variant` để phân biệt default, loading, empty, validation-error, modal-open, mobile, desktop, v.v.
6. Chỉ ghi nhận điều nhìn thấy hoặc được xác nhận từ canonical docs hiện có.

ĐƯỢC PHÉP SUY RA Ở MỨC UI EVIDENCE:
- screen/page name ở mức suggestion
- visible sections/components
- visible field labels/types khi rõ ràng
- required marker nếu thực sự nhìn thấy
- buttons/actions
- visible validation/error/success messages
- visible navigation cues
- screen state/variant
- responsive/platform clues

KHÔNG ĐƯỢC TỰ BỊA TỪ HÌNH ẢNH:
- API endpoint/request/response
- database table/schema
- hidden business rules
- permissions/roles nếu UI không nói rõ
- server-side validation
- edge cases không nhìn thấy
- route nếu không có evidence

Nếu chưa biết, đưa vào `openQuestions` thay vì biến assumption thành fact.

MAPPING VỚI DOCS HIỆN CÓ:
- Nếu xác định chắc chắn Screen đã tồn tại, set `existingScreenCode`.
- Chỉ set `featureCodes`, `requirementCodes`, `businessRuleCodes`, `flowCodes` khi code đó đã tồn tại và có evidence hợp lý.
- Không tạo code giả chỉ để đầy đủ relation.

CLASSIFICATION:
- `screen`: ảnh mô tả một Screen/state cần trace vào Screen doc.
- `component`: component/widget độc lập, chưa đủ để tạo Screen mới.
- `flow`: sơ đồ/sequence visual, không phải Screen screenshot.
- `reference`: visual style/reference không phải requirement trực tiếp.
- `ignore` / `non-screen`: asset không cần Screen mapping.

OUTPUT SAU KHI PHÂN TÍCH:
1. Chạy `npm run mockup:candidates`.
2. Review candidate trước khi promote.
3. Candidate tạo Screen mới chỉ được promote sau review accepted.
4. Candidate map vào Screen đã tồn tại mặc định chỉ tạo enrichment proposal; không overwrite canonical Screen tự động.
5. Sau khi reconcile, chạy `npm run mockup:report` và `npm run mockup:check`.

MỤC TIÊU CUỐI:
- Mỗi screen mockup phải map được tới Screen canonical hoặc được review/classify là non-screen/reference.
- Screen docs phải nêu rõ mockup refs và state coverage.
- Các gap về Feature/Requirement/Rule/Flow/API/Test phải được đưa về workflow docs-first hiện có, không được giải quyết bằng suy đoán từ ảnh.
```
