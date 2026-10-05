# Project Blueprint Seed

## Modules
| Code | Module | Purpose | Reuse Source |
|---|---|---|---|
| MOD-AUTH | Authentication | User authentication and account access | |

## Features
| Code | Module | Feature | Applications | Spec Level | Maturity | Requirements | Screens | APIs | Tests |
|---|---|---|---|---|---|---|---|---|---|
| FEAT-AUTH-LOGIN | MOD-AUTH | Login | APP-WEB | standard | production | REQ-AUTH-LOGIN-001 | SCR-AUTH-LOGIN | API-AUTH-LOGIN | TC-AUTH-LOGIN-001 |

## Requirements
| Code | Feature | Requirement | Behaviour | Acceptance |
|---|---|---|---|---|
| REQ-AUTH-LOGIN-001 | FEAT-AUTH-LOGIN | Authenticate active user | Valid credentials create a session | Given an active user, when valid credentials are submitted, then login succeeds. |

## Business Rules
| Code | Feature | Rule | Criticality |
|---|---|---|---|
| BR-AUTH-001 | FEAT-AUTH-LOGIN | Inactive users cannot authenticate | critical |

## Screens / Routes
| Code | Route | Feature | Platform |
|---|---|---|---|
| SCR-AUTH-LOGIN | /login | FEAT-AUTH-LOGIN | web |

## APIs
| Code | Method | Path | Feature |
|---|---|---|---|
| API-AUTH-LOGIN | POST | /api/auth/login | FEAT-AUTH-LOGIN |

## Database Objects
| Code | Schema/Object | Feature/Owner |
|---|---|---|

## Test Cases
| Code | Feature | Title | Verifies | Acceptance Criteria | Business Rule Cases |
|---|---|---|---|---|---|
| TC-AUTH-LOGIN-001 | FEAT-AUTH-LOGIN | Successful login | REQ-AUTH-LOGIN-001 | REQ-AUTH-LOGIN-001#AC-01 | |
