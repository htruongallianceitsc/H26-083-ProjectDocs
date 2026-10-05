# Web Application Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Phân tách UI/component, routing, server-state, client-state và service/integration boundary.
- Mỗi route phải map tới Screen/Feature và có auth/permission behavior rõ.
- Mỗi data-heavy screen phải có loading/empty/error/partial/refetch states.
- Browser compatibility, accessibility, security headers, caching và observability phải được định nghĩa ở project level.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
