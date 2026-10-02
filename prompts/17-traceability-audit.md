# Prompt 17 — Traceability Audit

```text
Audit toàn project theo relation-map và quality-rules.

Tạo matrix:
Module -> Feature -> Requirement/Rule -> Screen/Flow -> API -> DB -> Test.

Báo riêng:
- Feature không có Requirement
- Requirement không có Test
- Screen/API orphan
- API persistence nhưng thiếu DB impact
- Business Rule critical chưa được test
- Blueprint item thiếu detail doc
- Detail doc không xuất hiện trong Blueprint khi đáng lẽ phải có

Không tự tạo relation chỉ vì tên gần giống nhau.
```
