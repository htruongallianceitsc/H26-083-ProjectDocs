---
code: MOD-AUTH
type: module
title: Authentication
status: draft
owner: {{OWNER}}
created_at: {{IMPORT_DATE}}
updated_at: {{IMPORT_DATE}}
last_reviewed_at: {{IMPORT_DATE}}
tags: [reusable-capability, auth]
related:
  features: [FEAT-AUTH-LOGIN, FEAT-AUTH-LOGOUT, FEAT-AUTH-FORGOT-PASSWORD, FEAT-AUTH-RESET-PASSWORD, FEAT-AUTH-REGISTER, FEAT-AUTH-GOOGLE-LOGIN, FEAT-AUTH-EMAIL-VERIFICATION]
  decisions: []
  nfrs: []
  open_questions: []
---

# Authentication Module

## Purpose

Provide a reusable authentication capability baseline. Project-specific RBAC, password policy, session lifetime, legal copy and compliance decisions must be reviewed locally.

## Scope

Authentication entry, session establishment/termination and account recovery. Optional registration, Google sign-in and email verification are selected during pack import.

## Shared Concepts

- Login identifier: `{{LOGIN_IDENTIFIER}}`.
- Session strategy: `{{SESSION_STRATEGY}}`.
- Authentication route prefix: `{{AUTH_ROUTE_PREFIX}}`.
- Authentication API prefix: `{{AUTH_API_PREFIX}}`.

## Reuse Boundary

This document becomes project-local canonical documentation after import. Pack provenance is maintained outside business frontmatter in `.project-docs/packs.lock.json`.
