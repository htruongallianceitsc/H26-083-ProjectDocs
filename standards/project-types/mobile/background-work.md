# Mobile Background Work Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Mọi background work phải dựa capability thật của iOS/Android, không dựa timer giả định.
- Job phải chịu được OS kill/delay và chạy lại idempotent.
- Location/audio/upload/background fetch phải có permission/battery rationale.
- Notification/background handler phải tránh UI dependency.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
