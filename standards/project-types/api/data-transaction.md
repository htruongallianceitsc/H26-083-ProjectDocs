# API Data & Transaction Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Xác định transaction boundary cho multi-write.
- Concurrency/optimistic locking cần cho dữ liệu dễ xung đột.
- Migration phải forward-safe và rollback/roll-forward aware.
- Query/index phải review theo expected volume.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
