# Prompt 50 — Screen Lifecycle / System Behaviour and Gap Promotion

Use this prompt only during an active Screen-first review when a Screen reveals behaviour that is not driven by a direct user control, or when a reviewed gap needs to become canonical documentation.

## Goal

Separate visible UI from automatic behaviour, then propose the minimum canonical entity set needed to make the behaviour implementation-ready.

## Rules

1. Do not invent buttons for automatic behaviour.
2. Classify behaviour as one of:
   - User Action;
   - Lifecycle Action (`onEnter`, `onResume`, `onRefresh`, `onExit`, etc.);
   - System Action (automatic decision, persistence, timer, evaluation, auto-navigation);
   - API Interaction.
3. A Screen is not the owner of hidden business truth. Put behaviour/acceptance in Requirement, multi-step sequencing in Flow, and transport contract in API.
4. Unknown failure, retry, timeout, caching, fallback, permission or offline behaviour must remain an Open Question/TBD until confirmed.
5. For a reviewed gap, create a promotion draft first. Exact entity codes, relations and bodies must be authored/reviewed before applying.
6. Never overwrite an existing canonical entity silently.

## Startup / Splash example

If the requested behaviour is "show logo + loading, call GET config, then enter the main app", consider:

- Feature: App Startup / Bootstrap;
- Screen: Splash / Bootstrap;
- Requirements: show startup state, load mandatory config, success navigation, failure behaviour;
- Flow: App Launch -> Splash -> GET Config -> Success/Failure;
- API: Get Config;
- Tests: success + failure/retry/fallback decisions.

Do not assume the failure strategy. Ask or preserve it as TBD/Open Question.
