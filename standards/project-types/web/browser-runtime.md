# Browser Runtime Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Khai báo browser support matrix và policy khi browser không hỗ trợ.
- Theo dõi memory, DOM growth, large response và long task cho màn hình trọng yếu.
- Xác định cache/service-worker/PWA policy nếu có.
- Không lưu token hoặc sensitive data ở storage không phù hợp.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
