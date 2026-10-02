# Prompt 09 — API Contracts

```text
Từ Feature, Screen và Flow đã approved, xác định API cần thiết và tạo API docs.

Mỗi API gồm:
- method/path/purpose
- auth + permission
- path/query/header/body
- response
- validation
- business rules applied
- error codes
- idempotency/concurrency
- transaction boundary
- DB read/write objects
- external dependencies
- logging/audit
- performance expectation
- related feature/screen/tests

Không tự thêm endpoint nếu có thể reuse contract hiện có; nêu rõ đề xuất vs confirmed.
```
