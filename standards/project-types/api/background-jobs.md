# API Background Job Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Job phải idempotent hoặc có deduplication key.
- Retry/dead-letter/failure escalation phải định nghĩa.
- Job payload phải versioned khi producer/consumer deploy độc lập.
- Có observability theo job/run/correlation id.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
