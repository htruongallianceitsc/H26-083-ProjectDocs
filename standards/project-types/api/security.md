# API Security Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Input validation/normalization server-side.
- Rate limit/abuse protection cho endpoint nhạy cảm.
- Secret management không qua source/config plaintext.
- OWASP API risks được review trước release.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
