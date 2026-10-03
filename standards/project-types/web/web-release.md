# Web Release Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Release phải có build artifact immutable, environment config và rollback strategy.
- Migration/API compatibility phải được kiểm tra trước deploy.
- Feature flag dùng cho rollout rủi ro cao.
- Production smoke test và monitoring window phải được định nghĩa.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
