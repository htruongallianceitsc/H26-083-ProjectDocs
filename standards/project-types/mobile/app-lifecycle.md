# App Lifecycle Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Document Start/Foreground/Background/Inactive/Terminated/Resume/Process death behavior.
- Resume phải xác định refresh stale data, token validation, socket reconnect và pending sync.
- Background không được giả định timer/socket tiếp tục chạy.
- Process death phải có state restoration strategy cho flow quan trọng.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
