# Security & Secrets Documentation Rules

- Không ghi production password, API key, token, private key, secret value vào repo tài liệu.
- Chỉ document tên biến/config và nơi quản lý secret.
- Sensitive sample data phải fake/anonymized.
- Với PII/financial/health data, ghi classification + retention + masking + audit requirements.
- Production access procedure phải mô tả role/process, không chứa credential.
