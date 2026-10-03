# API Authentication & Authorization Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Authentication và authorization là hai concern riêng.
- Mọi endpoint phải khai báo auth, permission/role/scope.
- Object-level authorization phải kiểm tra ở server.
- Sensitive action cần audit evidence.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
