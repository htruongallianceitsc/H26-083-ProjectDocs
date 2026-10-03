# Mobile Logging & Observability Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Crash-free, ANR, startup, screen latency và network error cần metrics theo app version.
- Logs có SessionId/RequestId/CorrelationId khi có thể.
- Source map/dSYM/symbol mapping phải upload theo release.
- Mask token, phone, email, document id và payload nhạy cảm.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
