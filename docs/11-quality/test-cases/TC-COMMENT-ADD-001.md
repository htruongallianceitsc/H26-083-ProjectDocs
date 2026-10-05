---
code: TC-COMMENT-ADD-001
type: test-case
title: Only author or admin can edit/delete a comment
status: draft
owner: QA Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [comment, test]
related:
  modules: [MOD-COMMENT]
  features: [FEAT-COMMENT-ADD]
  requirements: [REQ-COMMENT-001]
  business_rules: [BR-COMMENT-001]
  screens: []
  flows: []
  apis: [API-COMMENT-CREATE, API-COMMENT-UPDATE, API-COMMENT-DELETE]
  database_objects: []
  decisions: []
---

# Test Case

## Objective
Verify comment creation and edit/delete permission enforcement.

## Verifies
`REQ-COMMENT-001`, `BR-COMMENT-001`, `API-COMMENT-CREATE`, `API-COMMENT-UPDATE`, `API-COMMENT-DELETE`

## Preconditions
Card `C`; author `A` posts a comment; user `B` is a plain `member` in the same workspace (not owner/admin, not the author).

## Test Data
`{ "body": "Looks good to me." }`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | As `A`, POST `/api/cards/{C}/comments` with test data | `201 Created` |
| 2 | As `B`, PATCH the comment with a new body | `403 FORBIDDEN` |
| 3 | As `B`, DELETE the comment | `403 FORBIDDEN` |
| 4 | As `A`, PATCH the comment with a new body | `200 OK`, `editedAt` set |
| 5 | As `A`, DELETE the comment | `204 No Content` |

## Postconditions
Comment is soft-deleted; appears as a tombstone in the thread.

## Priority
P1

## Automation Candidate
Yes — API integration test.

## Notes
None.
