# API Architecture Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Tách transport/application/domain/infrastructure theo mức phù hợp; không đặt business logic trong controller/route handler.
- API contract là source of truth cho request/response/error/auth.
- Transaction boundary, side effect và external integration phải rõ.
- Background work không được giả định request HTTP còn sống.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
