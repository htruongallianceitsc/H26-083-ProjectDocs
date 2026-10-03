# Push Notification Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Phân biệt notification payload và data payload.
- Xử lý foreground/background/terminated và token refresh.
- Payload phải versioned và không lộ sensitive data.
- Push navigation phải map canonical route hoặc explicit no-navigation.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
