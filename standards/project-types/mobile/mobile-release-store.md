# Mobile Release & Store Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Version/build number, signing/certificate/provisioning ownership phải có runbook.
- App Store/Google Play privacy/review metadata phải được review cùng binary.
- Staged rollout/hotfix/min-supported-version/maintenance mode phải có policy.
- Backend phải backward-compatible với binary cũ trong support window.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
