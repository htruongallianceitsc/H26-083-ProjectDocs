# Mobile Networking Resilience Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Timeout, cancellation, retry/backoff và stale-request cancellation phải được chuẩn hóa.
- Network switch Wi-Fi/4G/5G, offline/online transition phải có behavior.
- Không retry mutation mù; cần idempotency/deduplication.
- Slow network UX phải khác hard error khi phù hợp.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
