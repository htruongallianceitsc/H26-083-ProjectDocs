# Offline & Sync Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Mỗi offline-capable feature phải chọn cache-first/network-first/stale-while-revalidate rõ.
- Queued mutation cần idempotency key, ordering, retry và conflict policy.
- Sync cursor/version/timestamp source of truth phải xác định.
- UI phải phân biệt local pending/synced/failed khi nghiệp vụ cần.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
