# Mobile Performance Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Đặt budget cold/warm start, memory, JS/UI thread, frame drop, list rendering, image và bundle size.
- Không decode ảnh/file lớn trên UI thread.
- Theo dõi performance theo device tier và OS.
- Regression performance là release gate cho critical flow.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
