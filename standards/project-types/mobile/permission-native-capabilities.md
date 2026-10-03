# Permission & Native Capability Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Mỗi permission phải có purpose, trigger, pre-prompt nếu cần và fallback UX.
- Xử lý denied, permanently denied/revoked, limited và OS settings return.
- Permission không được xin sớm hơn nhu cầu nghiệp vụ nếu không cần.
- Camera/photo/location/biometric/file/notification phải có platform difference documented.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
