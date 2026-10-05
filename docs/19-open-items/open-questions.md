# Open Questions

| ID | Category | Question | Why It Matters | Owner | Blocking | Status |
|---|---|---|---|---|---|---|
| OQ-001 | Product | Will KanbanFlow need a billing/subscription model, and what does that imply for the Workspace data model? | Retrofitting billing later could require migration | Product Owner | No | Open |
| OQ-002 | Product/UX | Is "reconcile-and-toast" conflict handling for concurrent card moves (`BR-CARD-001`) good enough long-term? | May need richer UX if concurrent editing becomes frequent | Frontend Team | No | Open |
| OQ-003 | Technical | Which file storage provider backs Card attachments? | Blocks building attachments into `FEAT-CARD-EDIT-DETAIL` | Engineering Lead | No | Open |
| OQ-004 | Product | Should Checklists be a first-class Card sub-entity (own table/API) in the next phase? | Affects `DB-CARD`-adjacent schema and `FEAT-CARD-EDIT-DETAIL` scope | Product Owner | No | Open |
| OQ-005 | Technical | Which transactional email/notification provider do we standardize on? | Blocks finalizing `INT-EMAIL` before production release | Engineering Lead | Yes | Open |
| OQ-006 | Product | What is the priority/timeline for a native mobile app? | Determines when `docs/20-mobile/` gets populated | Product Owner | No | Open |

See individual `OQ-00N.md` documents in this directory for full detail on each question.
