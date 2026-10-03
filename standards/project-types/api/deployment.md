# API Deployment Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Health/readiness/liveness phù hợp runtime.
- Backward-compatible deploy khi có rolling/multi-instance.
- DB migration ordering không làm binary cũ hỏng.
- Rollback và incident runbook phải tồn tại.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
