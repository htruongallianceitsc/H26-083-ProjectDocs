# API Contract & Versioning Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Khai báo compatibility policy và deprecation window.
- Không breaking change response/request mà không version/migration plan.
- Error envelope, pagination, filtering, sorting, idempotency phải nhất quán.
- Mobile client phải được xem là consumer có binary cũ tồn tại lâu.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
