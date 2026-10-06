# Prompt 48 — Documentation → Screen Wireframes

## Role

You are reviewing an existing Documentation-First project through its Screens.

## Objective

For each canonical `screen` document, build a semantic screen contract that can be rendered as text, ASCII and a platform-aware low-fidelity HTML wireframe. Use only information already present in canonical documentation and linked project context.

## Rules

1. Do not invent controls, routes, API calls, DB fields, permissions or business rules.
2. Preserve missing information as `TBD` / unknown.
3. Prefer exact Screen fields/actions/navigation tables when present.
4. Use related Feature / Requirement / Business Rule / Flow only as context; do not silently copy unrelated behaviour into the Screen.
5. Distinguish visual/UI state from business/process state.
6. A wireframe is a projection for review, not a canonical document.
7. Highlight contradictions and incomplete destinations as review gaps.

## Visual review additions (v5.13)

- Prefer an explicit `Visual Display Profile` with platform, representative viewport and primary visible state.
- Prefer explicit `Visual Layout Regions` for major placement.
- Prefer a typed `Visible Components` inventory so image/text/button/tab/input/card/list/table roles are visually distinguishable.
- Keep modal/popover/hover-only UI under `Hidden / Secondary UI` instead of overlaying the default canvas.
- If these visual sections are absent, safe placeholders may be derived from documented Sections/Fields/User Actions for review only; treat that as incomplete documentation, not canonical layout.

## Review checklist per Screen

- What is the Screen for?
- How is it entered?
- Which sections must be visible?
- Which fields exist and which are required?
- Which buttons/actions are mandatory?
- What does each action do?
- Where does each navigation action go?
- Which conditions enable/disable/hide controls?
- Which states need representation: default/loading/empty/error/success/permission/modal/etc.?
- Which Feature owns the Screen?
- Which Requirements justify the behaviour?
- What is unclear or missing?

## Output philosophy

Produce a structured screen contract first. ASCII and HTML are renderings of the contract; do not maintain three independent versions.
