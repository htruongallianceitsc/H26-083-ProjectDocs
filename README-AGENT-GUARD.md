# Agent guard (giải nén đè lên thư mục gốc repo)

| File | Tác dụng | Mức chặn |
|---|---|---|
| `AGENTS.md` | Bản đồ đọc: đọc gì, không đọc gì, vòng lặp từng đơn vị | Chỉ dẫn (agent có thể bỏ qua) |
| `CLAUDE.md` | Nhập `AGENTS.md` cho Claude Code | Chỉ dẫn |
| `.claude/settings.json` | `permissions.deny` cho công cụ Read | Chặn cứng với Read tool |
| `.cursorignore`, `.aiderignore` | Cùng danh sách cho Cursor và Aider | Chặn theo cơ chế của từng công cụ |
| `tools/scripts/agent-pack.mjs` | Sinh gói tác vụ nhỏ từ registry/template của kit | Thay cho việc đọc `kit/` |
| `tools/scripts/brownfield-budget.mjs` | Ước tính token theo từng Feature | Kiểm soát |

## Cài đặt (2 dòng)
Thêm vào `scripts` của `tools/package.json`:
    "agent:pack": "node scripts/agent-pack.mjs",
    "brownfield:budget": "node scripts/brownfield-budget.mjs"
Thêm vào `.gitignore`: `.project-docs/agent-packs/`

## Dùng
    cd tools
    npm run agent:pack -- --types feature,requirement,business-rule,api,test-case --out author-core
    npm run agent:pack -- --types screen --out author-screen      # chỉ khi cần Screen
    npm run agent:pack -- --types feature --full-templates        # nếu bản gọn thiếu hướng dẫn

## Lưu ý
- Gói tác vụ bỏ phần văn xuôi trong template (chỉ giữ tiêu đề, cột bảng); phần "Conventions" là viết tay trong script (không tự sinh), cần cập nhật khi kit đổi.
- Rule trong gói chọn theo số thứ tự (`--rules`), có thể lệch nếu kit đánh số lại `ai-agent-rules.md`.
- Deny của Claude Code chỉ áp dụng cho công cụ Read; lệnh shell (`cat`) cần cơ chế riêng (sandbox hoặc rule Bash) tuỳ phiên bản.
