# Capability Pack Standard

A Capability Pack represents a reusable business/system capability such as AUTH, RBAC, FILE UPLOAD, NOTIFICATION or AUDIT LOG.

## Required characteristics
- Stable package identity and semantic version.
- Required and optional features are explicit.
- Variables contain values that are expected to differ by project.
- Unsafe defaults become Open Questions or ADRs instead of hidden assumptions.
- Every file has a deterministic destination.
- Import is preview-first.
- Project-local files become canonical after import.
- Provenance, base snapshots and review status are stored outside business documents.
- Upgrade uses base/upstream/local comparison and never overwrites conflicts silently.

## Do not package blindly
Secrets, environment URLs, legal copy, concrete session durations, role models, retention requirements and compliance decisions must remain variables/questions/ADRs unless truly universal.
