# Web Performance Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Đặt budget cho initial JS, route chunk, image, API payload và Core Web Vitals.
- Large list dùng virtualization/pagination phù hợp.
- Không fetch toàn bộ dataset chỉ để filter client nếu volume có thể tăng.
- Theo dõi regression theo release.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
