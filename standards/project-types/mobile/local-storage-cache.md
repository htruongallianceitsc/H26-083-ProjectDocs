# Local Storage & Cache Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Phân loại Preferences, Session, Cache, Offline DB, Sensitive secrets.
- Sensitive secret dùng Keychain/Keystore/Secure Storage.
- Cache phải có TTL/eviction/size policy.
- Schema migration, cleanup logout và backward compatibility phải được test.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
