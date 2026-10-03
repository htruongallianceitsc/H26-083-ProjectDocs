# Connectivity & Realtime Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- WebSocket/SignalR có connect/disconnect/reconnect/backoff/heartbeat contract.
- Resume phải rejoin group/channel an toàn và chống duplicate event.
- Event ordering/message ACK/offline catch-up phải xác định.
- Không dùng socket làm nguồn duy nhất nếu mất event không thể phục hồi.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
