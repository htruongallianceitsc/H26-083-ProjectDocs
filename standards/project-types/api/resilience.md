# API Resilience Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Timeout cho outbound call là bắt buộc.
- Retry chỉ dùng cho operation an toàn/idempotent; phải có backoff/jitter.
- Circuit breaker/bulkhead dùng khi dependency critical.
- Request cancellation và duplicate request behavior phải rõ.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
