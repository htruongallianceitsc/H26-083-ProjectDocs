# Navigation & Deep Link Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Route phải typed/canonical, params/query versionable và validate trước navigation.
- Auth/permission guard không nằm rải rác ở screen.
- Deep link phải xử lý invalid/unauthorized/deleted target.
- Push, universal/app link và internal navigation phải converge về cùng route contract.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
