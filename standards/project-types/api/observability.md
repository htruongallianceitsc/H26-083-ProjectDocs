# API Observability Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Structured log với TraceId/RequestId/CorrelationId.
- Metrics tối thiểu: request rate/error/latency/saturation.
- External calls và DB slow operations phải trace được.
- Mask secrets/PII trong logs.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
