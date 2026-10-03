# Mobile Architecture Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Tách presentation/navigation, state, domain/use-case, repository/data source, native capability và storage boundary.
- UI không gọi API/native SDK trực tiếp nếu có business rule.
- Project phải định nghĩa ownership của server state và local/client state.
- Native module/plugin phải có abstraction để test và thay đổi platform implementation.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
