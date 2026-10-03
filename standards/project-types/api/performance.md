# API Performance Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Đặt latency SLO/P95/P99 cho endpoint trọng yếu.
- Đặt payload limit và pagination max.
- Review N+1, unbounded query, connection pool và serialization cost.
- Load test dựa trên capacity assumption.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
