# Screen-First Wireframe Analysis Standard — v5.11

## Purpose

Cung cấp một **optional analysis mode** khi team muốn tạm thời tập trung vào Screen trước để tìm thiếu sót trong tài liệu. Mode này chiếu canonical documentation thành wireframe review artifacts, cho phép reviewer nhìn từng Screen như một UI contract, rồi đưa các gap phát hiện được quay ngược về Screen / Feature / Requirement / Business Rule / Flow.

Wireframe **không phải source of truth**. Nó là projection có thể rebuild.

## Core loop

```text
Canonical Docs
  Screen + Feature + Requirement + Flow
                |
                v
        Wireframe Projection
     text + ASCII + combined HTML
                |
                v
          Screen Review
                |
                v
          Gap Proposals
                |
                v
      Update Canonical Docs
                |
                v
       Rebuild + Re-review
```

## Why three formats exist

| Format | Best for | Strength | Limitation | Priority |
|---|---|---|---|---|
| Text-based wireframe/spec | AI review, Git diff, semantic completeness | structured, parseable, compact | less visual | **Canonical projection layer** |
| HTML wireframe | Human screen review, navigation, whole-app walkthrough | visual, interactive, can group all Screens | generated artifact; should not be hand-edited | **Primary human review surface** |
| ASCII mockup | terminal/chat review, very early discussion | fastest, portable, no browser | layout becomes noisy on complex/responsive screens | Convenience output |

The recommended architecture is therefore **Text model → ASCII/HTML renderers**, not three independent truths.

## Source-of-truth boundary

Canonical ownership remains:

- Screen: visible structure, fields, controls, states, navigation behaviour.
- Feature: functional ownership and user capability.
- Requirement: expected behaviour / acceptance.
- Business Rule: constraints and decision logic.
- Flow: multi-screen/process sequence.
- API / DB: technical contracts.

Generated wireframes only reflect what those documents currently say. `TBD` must stay visible when documentation is incomplete.

## Screen contract required for useful projection

A detailed Screen should make the following reviewable:

1. Purpose and route.
2. Layout / sections.
3. Fields and required/validation semantics.
4. Actions / controls.
5. UI states.
6. Navigation destinations and conditions.
7. Visible messages and validation.
8. Related Feature / Requirement / Business Rule / Flow.
9. Open questions.

Do not hide missing information by inventing controls or targets in the renderer.

## Combined HTML wireframe

The preferred human artifact is one standalone file:

```text
docs/_generated/SCREEN_WIREFRAMES.html
```

It should contain:

- searchable Screen sidebar;
- one wireframe panel per Screen;
- route + Feature/Requirement context;
- sections, fields, actions, states and navigation;
- anchor links between Screens when a destination Screen code is known;
- visible `TBD`/gap markers;
- source document path/hash so stale projections are detectable.

The file may look like a mockup gallery but remains a generated specification view, not a pixel-perfect design system.

## Review-to-doc rules

A reviewer finding must become a proposal first. Typical examples:

- Login Screen has no Forgot Password action.
- Save button exists but destination/side effect is undefined.
- Empty state is missing.
- Screen appears to need Feature ownership.
- Field validation is unclear.
- Navigation from List → Detail is not documented.

Accepted gaps must be resolved by updating canonical docs. The tool must not silently patch business semantics from HTML edits.

## Optional lifecycle

This mode is not required for every project or every Feature.

```text
inactive
  -> start review session
  -> build projections
  -> record/review gaps
  -> update canonical docs
  -> rebuild until clean enough
  -> close session
```

Normal `qa` must not force every project to use this mode. When a session is active, stale projections and accepted unresolved gaps can become blocking findings.

## When to prefer which format

### Prefer HTML when

- PM/BA/UX wants to inspect many Screens together.
- Navigation and completeness across a flow matter.
- Screen composition is more important than pixel precision.
- Stakeholders are not comfortable reading Markdown.

### Prefer text-based wireframe when

- AI needs structured context.
- You want Git-reviewable screen contracts.
- The UI is data-heavy or responsive and ASCII would be misleading.
- You need reliable transformation into other renderers.

### Prefer ASCII when

- discussing one simple Screen in chat/terminal;
- prototyping quickly before opening a browser;
- visual fidelity is unimportant.

For production documentation, use **text as the semantic projection + HTML as the main review UI + ASCII as optional convenience**.
