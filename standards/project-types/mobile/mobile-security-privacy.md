# Mobile Security & Privacy Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Secrets không hardcode trong bundle.
- Sensitive storage dùng platform secure storage; logout phải cleanup.
- Quyết định screenshot/clipboard/root-jailbreak/biometric phải dựa threat model.
- SDK inventory, data collection purpose và Apple/Google privacy declaration phải đồng bộ.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
