# Prompt 04 — Module & Feature Decomposition

```text
Hãy phân rã scope thành Module và Feature.

Rules:
- Module là functional group của Feature, không phải container cho API/DB/Test.
- Feature nên mô tả capability có giá trị/business outcome rõ.
- Tránh feature quá kỹ thuật như "Create Repository Layer".
- Mỗi Feature có code, title, purpose, actors, priority, dependencies sơ bộ.
- Detect duplicate/overlap và đề xuất merge/split khi cần.
- Output gồm module tree + feature inventory + unresolved scope questions.
```
