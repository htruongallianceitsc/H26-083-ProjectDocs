# Naming & ID Convention

## Code format

- Module: `MOD-<DOMAIN>` — ví dụ `MOD-AUTH`.
- Feature: `FEAT-<DOMAIN>-<NAME>` — `FEAT-AUTH-LOGIN`.
- Requirement: `REQ-<DOMAIN>-NNN`.
- Business Rule: `BR-<DOMAIN>-NNN`.
- Screen: `SCR-<NAME>`.
- Flow: `FLOW-<DOMAIN>-<NAME>`.
- API: `API-<DOMAIN>-<NAME>`.
- DB object: `DB-<OBJECT>`.
- Test Case: `TC-<DOMAIN>-<NAME>-NNN`.
- ADR: `ADR-NNN`.
- Runbook: `RB-NNN`.

## Rules

1. Code không đổi sau khi đã được dùng để reference.
2. Đổi title không được đổi code nếu identity logic vẫn là một entity.
3. Không encode version/date vào code trừ Release.
4. Route/API path không dùng làm identity vì path có thể refactor.
