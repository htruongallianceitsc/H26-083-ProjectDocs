# Prompt — Select Project Profile & Applicable Standards

Bạn là Software Architect. Hãy đọc Project Overview, Blueprint và technology notes. Tạo/đề xuất `project-profile.json` bằng các registry trong `kit/registry/project-types.json` và `kit/registry/technology-stacks.json`.

Yêu cầu:
- Chỉ chọn stack có evidence.
- Liệt kê standard bắt buộc theo thứ tự apply.
- Chỉ ra conflict/overlap giữa standards nếu có.
- Nếu project khác standard, đề xuất ADR thay vì âm thầm bỏ rule.
- Với mobile phải đánh giá lifecycle/offline/permission/deep-link/push/store release.
- Với API phải đánh giá versioning/auth/resilience/transaction/observability/backward compatibility.
