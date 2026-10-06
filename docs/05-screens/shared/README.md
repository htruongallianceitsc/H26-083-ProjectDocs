# Shared Screen UI

This directory contains canonical reusable UI definitions introduced in v5.14.

- `components/`: `ui-component` entities such as a mobile Header or Bottom Navigation.
- `shells/`: `screen-shell` entities that compose shared components into a reusable Screen frame.

Screens remain the owner of screen-specific behaviour. A shared component owns visual structure and exposed slots; a shell owns reusable placement/composition; a Screen owns local content, actions, states and slot overrides.
