# Web Security Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Bắt buộc XSS/CSRF/CSP/cookie/session policy.
- Auth token storage strategy phải có threat rationale.
- PII không được log hoặc đưa vào URL/query nếu không cần thiết.
- Third-party script/SDK phải có inventory, purpose và data classification.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
