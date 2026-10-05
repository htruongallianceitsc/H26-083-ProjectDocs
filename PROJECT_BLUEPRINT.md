# Project Blueprint

This is the inventory map for KanbanFlow, a Trello-like board management web application. Every important Module, Feature, Screen/Route, API and DB object listed here has a detailed canonical document under `docs/`.

## Project Profile
- Project code: `KANBAN`
- Project types: `web`, `api`
- Technology stacks: `reactjs`, `nodejs-api`, `postgresql`

## Reuse Inventory
| Capability | Decision | Package/Standard | Version | Review |
|---|---|---|---|---|
| AUTH | standard | `standards/project-types/api/auth-authorization.md` + `reusable-modules/auth-standard` (reviewed, not imported as a pack) | n/a | reviewed |

## Modules
| Code | Module | Purpose | Reuse Source |
|---|---|---|---|
| MOD-AUTH | Authentication & Account | Register, login/logout, forgot/reset password | Standard |
| MOD-WORKSPACE | Workspace & Membership | Create workspace, invite/manage members and roles | Project-specific |
| MOD-BOARD | Board Management | Create/manage/archive boards | Project-specific |
| MOD-LIST | List Management | Manage lists and drag-and-drop reorder | Project-specific |
| MOD-CARD | Card Management | Create/move/edit/archive cards (the core work item) | Project-specific |
| MOD-LABEL | Labels | Manage board labels and assign them to cards | Project-specific |
| MOD-MEMBER | Card Members | Assign/unassign card responsibility | Project-specific |
| MOD-COMMENT | Comments & Activity | Card comments and auto-generated activity log | Project-specific |

## Features
| Code | Module | Feature | Requirements | Screens | APIs | Tests |
|---|---|---|---|---|---|---|
| FEAT-AUTH-REGISTER | MOD-AUTH | Register | REQ-AUTH-001 | SCR-REGISTER | API-AUTH-REGISTER | TC-AUTH-REGISTER-001 |
| FEAT-AUTH-LOGIN | MOD-AUTH | Login / Logout | REQ-AUTH-002 | SCR-LOGIN | API-AUTH-LOGIN, API-AUTH-LOGOUT | TC-AUTH-LOGIN-001 |
| FEAT-AUTH-FORGOT-PASSWORD | MOD-AUTH | Forgot / Reset Password | REQ-AUTH-003 | SCR-FORGOT-PASSWORD | API-AUTH-FORGOT-PASSWORD, API-AUTH-RESET-PASSWORD | TC-AUTH-FORGOT-PASSWORD-001 |
| FEAT-WORKSPACE-CREATE | MOD-WORKSPACE | Create Workspace | REQ-WORKSPACE-001 | SCR-WORKSPACE-HOME | API-WORKSPACE-CREATE, API-WORKSPACE-LIST | TC-WORKSPACE-CREATE-001 |
| FEAT-WORKSPACE-MANAGE-MEMBERS | MOD-WORKSPACE | Manage Workspace Members | REQ-WORKSPACE-002 | SCR-WORKSPACE-SETTINGS | API-WORKSPACE-INVITE-MEMBER, API-WORKSPACE-UPDATE-MEMBER-ROLE, API-WORKSPACE-REMOVE-MEMBER | TC-WORKSPACE-MANAGE-MEMBERS-001 |
| FEAT-BOARD-CREATE | MOD-BOARD | Create Board | REQ-BOARD-001 | SCR-WORKSPACE-HOME, SCR-BOARD | API-BOARD-CREATE | TC-BOARD-CREATE-001 |
| FEAT-BOARD-MANAGE | MOD-BOARD | Manage Board Settings | REQ-BOARD-002 | SCR-BOARD-SETTINGS | API-BOARD-GET-DETAIL, API-BOARD-UPDATE, API-BOARD-ARCHIVE | TC-BOARD-MANAGE-001 |
| FEAT-LIST-MANAGE | MOD-LIST | Manage Lists | REQ-LIST-001 | SCR-BOARD | API-LIST-CREATE, API-LIST-UPDATE | TC-LIST-MANAGE-001 |
| FEAT-LIST-REORDER | MOD-LIST | Reorder Lists (drag-and-drop) | REQ-LIST-002 | SCR-BOARD | API-LIST-REORDER | TC-LIST-REORDER-001 |
| FEAT-CARD-CREATE | MOD-CARD | Create Card | REQ-CARD-001 | SCR-BOARD | API-CARD-CREATE | TC-CARD-CREATE-001 |
| FEAT-CARD-MOVE | MOD-CARD | Move Card (drag-and-drop) | REQ-CARD-002 | SCR-BOARD | API-CARD-MOVE | TC-CARD-MOVE-001, TC-CARD-MOVE-002 |
| FEAT-CARD-EDIT-DETAIL | MOD-CARD | Edit Card Detail | REQ-CARD-003 | SCR-CARD-DETAIL | API-CARD-GET-DETAIL, API-CARD-UPDATE | TC-CARD-EDIT-DETAIL-001 |
| FEAT-CARD-ARCHIVE | MOD-CARD | Archive Card | REQ-CARD-004 | SCR-CARD-DETAIL, SCR-BOARD | API-CARD-ARCHIVE | TC-CARD-ARCHIVE-001 |
| FEAT-LABEL-MANAGE | MOD-LABEL | Manage Board Labels | REQ-LABEL-001 | SCR-BOARD-SETTINGS | API-LABEL-CREATE, API-LABEL-UPDATE, API-LABEL-DELETE | TC-LABEL-MANAGE-001 |
| FEAT-LABEL-ASSIGN | MOD-LABEL | Assign Label to Card | REQ-LABEL-002 | SCR-CARD-DETAIL | API-LABEL-ASSIGN, API-LABEL-REMOVE | TC-LABEL-ASSIGN-001 |
| FEAT-MEMBER-ASSIGN-CARD | MOD-MEMBER | Assign Card Member | REQ-MEMBER-001 | SCR-CARD-DETAIL | API-CARD-MEMBER-ASSIGN, API-CARD-MEMBER-REMOVE | TC-MEMBER-ASSIGN-CARD-001 |
| FEAT-COMMENT-ADD | MOD-COMMENT | Add / Edit / Delete Comment | REQ-COMMENT-001 | SCR-CARD-DETAIL | API-COMMENT-CREATE, API-COMMENT-UPDATE, API-COMMENT-DELETE | TC-COMMENT-ADD-001 |
| FEAT-ACTIVITY-LOG | MOD-COMMENT | Card Activity Log | REQ-COMMENT-002 | SCR-CARD-DETAIL | API-ACTIVITY-LIST | TC-ACTIVITY-LOG-001 |

## Screens / Routes
| Code | Route | Feature | Platform |
|---|---|---|---|
| SCR-LOGIN | /login | FEAT-AUTH-LOGIN | web |
| SCR-REGISTER | /register | FEAT-AUTH-REGISTER | web |
| SCR-FORGOT-PASSWORD | /forgot-password | FEAT-AUTH-FORGOT-PASSWORD | web |
| SCR-WORKSPACE-HOME | /w/:workspaceId | FEAT-WORKSPACE-CREATE, FEAT-BOARD-CREATE | web |
| SCR-WORKSPACE-SETTINGS | /w/:workspaceId/settings | FEAT-WORKSPACE-MANAGE-MEMBERS | web |
| SCR-BOARD | /b/:boardId | FEAT-LIST-MANAGE, FEAT-LIST-REORDER, FEAT-CARD-CREATE, FEAT-CARD-MOVE | web |
| SCR-BOARD-SETTINGS | /b/:boardId/settings | FEAT-BOARD-MANAGE, FEAT-LABEL-MANAGE | web |
| SCR-CARD-DETAIL | /b/:boardId/c/:cardId | FEAT-CARD-EDIT-DETAIL, FEAT-CARD-ARCHIVE, FEAT-LABEL-ASSIGN, FEAT-MEMBER-ASSIGN-CARD, FEAT-COMMENT-ADD, FEAT-ACTIVITY-LOG | web |

## APIs
| Code | Method | Path | Feature |
|---|---|---|---|
| API-AUTH-REGISTER | POST | /api/auth/register | FEAT-AUTH-REGISTER |
| API-AUTH-LOGIN | POST | /api/auth/login | FEAT-AUTH-LOGIN |
| API-AUTH-LOGOUT | POST | /api/auth/logout | FEAT-AUTH-LOGIN |
| API-AUTH-FORGOT-PASSWORD | POST | /api/auth/forgot-password | FEAT-AUTH-FORGOT-PASSWORD |
| API-AUTH-RESET-PASSWORD | POST | /api/auth/reset-password | FEAT-AUTH-FORGOT-PASSWORD |
| API-WORKSPACE-CREATE | POST | /api/workspaces | FEAT-WORKSPACE-CREATE |
| API-WORKSPACE-LIST | GET | /api/workspaces | FEAT-WORKSPACE-CREATE |
| API-WORKSPACE-INVITE-MEMBER | POST | /api/workspaces/{workspaceId}/members | FEAT-WORKSPACE-MANAGE-MEMBERS |
| API-WORKSPACE-UPDATE-MEMBER-ROLE | PATCH | /api/workspaces/{workspaceId}/members/{userId} | FEAT-WORKSPACE-MANAGE-MEMBERS |
| API-WORKSPACE-REMOVE-MEMBER | DELETE | /api/workspaces/{workspaceId}/members/{userId} | FEAT-WORKSPACE-MANAGE-MEMBERS |
| API-BOARD-CREATE | POST | /api/workspaces/{workspaceId}/boards | FEAT-BOARD-CREATE |
| API-BOARD-GET-DETAIL | GET | /api/boards/{boardId} | FEAT-BOARD-MANAGE |
| API-BOARD-UPDATE | PATCH | /api/boards/{boardId} | FEAT-BOARD-MANAGE |
| API-BOARD-ARCHIVE | POST | /api/boards/{boardId}/archive | FEAT-BOARD-MANAGE |
| API-LIST-CREATE | POST | /api/boards/{boardId}/lists | FEAT-LIST-MANAGE |
| API-LIST-UPDATE | PATCH | /api/lists/{listId} | FEAT-LIST-MANAGE |
| API-LIST-REORDER | PATCH | /api/lists/{listId}/position | FEAT-LIST-REORDER |
| API-CARD-CREATE | POST | /api/lists/{listId}/cards | FEAT-CARD-CREATE |
| API-CARD-GET-DETAIL | GET | /api/cards/{cardId} | FEAT-CARD-EDIT-DETAIL |
| API-CARD-UPDATE | PATCH | /api/cards/{cardId} | FEAT-CARD-EDIT-DETAIL |
| API-CARD-MOVE | PATCH | /api/cards/{cardId}/move | FEAT-CARD-MOVE |
| API-CARD-ARCHIVE | POST | /api/cards/{cardId}/archive | FEAT-CARD-ARCHIVE |
| API-LABEL-CREATE | POST | /api/boards/{boardId}/labels | FEAT-LABEL-MANAGE |
| API-LABEL-UPDATE | PATCH | /api/labels/{labelId} | FEAT-LABEL-MANAGE |
| API-LABEL-DELETE | DELETE | /api/labels/{labelId} | FEAT-LABEL-MANAGE |
| API-LABEL-ASSIGN | POST | /api/cards/{cardId}/labels/{labelId} | FEAT-LABEL-ASSIGN |
| API-LABEL-REMOVE | DELETE | /api/cards/{cardId}/labels/{labelId} | FEAT-LABEL-ASSIGN |
| API-CARD-MEMBER-ASSIGN | POST | /api/cards/{cardId}/members/{userId} | FEAT-MEMBER-ASSIGN-CARD |
| API-CARD-MEMBER-REMOVE | DELETE | /api/cards/{cardId}/members/{userId} | FEAT-MEMBER-ASSIGN-CARD |
| API-COMMENT-CREATE | POST | /api/cards/{cardId}/comments | FEAT-COMMENT-ADD |
| API-COMMENT-UPDATE | PATCH | /api/comments/{commentId} | FEAT-COMMENT-ADD |
| API-COMMENT-DELETE | DELETE | /api/comments/{commentId} | FEAT-COMMENT-ADD |
| API-ACTIVITY-LIST | GET | /api/cards/{cardId}/activity | FEAT-ACTIVITY-LOG |

## Database Objects
| Code | Schema/Object | Feature/Owner |
|---|---|---|
| DB-USER | public.users | MOD-AUTH |
| DB-WORKSPACE | public.workspaces | MOD-WORKSPACE |
| DB-WORKSPACE-MEMBER | public.workspace_members | MOD-WORKSPACE |
| DB-BOARD | public.boards | MOD-BOARD |
| DB-LIST | public.lists | MOD-LIST |
| DB-CARD | public.cards | MOD-CARD |
| DB-CARD-MEMBER | public.card_members | MOD-MEMBER |
| DB-LABEL | public.labels | MOD-LABEL |
| DB-CARD-LABEL | public.card_labels | MOD-LABEL |
| DB-COMMENT | public.comments | MOD-COMMENT |
| DB-ACTIVITY-LOG | public.activity_log | MOD-COMMENT |
| DB-REFRESH-TOKEN | public.refresh_tokens | MOD-AUTH |
| DB-PASSWORD-RESET-TOKEN | public.password_reset_tokens | MOD-AUTH |

## Mobile Inventory (when applicable)
Not applicable in this phase (`projectTypes` = `web`, `api` only; see `docs/00-project/product-scope.md` Out of Scope).

## External Integrations
| Code | Provider | Purpose | Owner |
|---|---|---|---|
| INT-EMAIL | Transactional email provider (TBD, see `OQ-005`) | Password reset emails, workspace invite emails | MOD-AUTH / MOD-WORKSPACE |

## Open Questions / Decisions
See `docs/19-open-items/open-questions.md` (OQ-001 .. OQ-006) and `docs/15-decisions/` (ADR-001 .. ADR-006).
