---
code: REQ-DEMO-001
type: requirement
title: Demo Requirement
status: approved
related:
  tests: [TC-DEMO-001]
---
# Demo Requirement

## Statement

The system shall support the demo action.

## Acceptance Criteria

| ID | Type | Scenario | Criterion |
|---|---|---|---|
| AC-01 | happy-path | Demo action succeeds | Given a valid demo request When the action is submitted Then the system accepts it. |
