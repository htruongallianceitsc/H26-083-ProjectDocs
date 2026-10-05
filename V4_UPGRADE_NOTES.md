# Starter Kit v4 Upgrade Notes

V4 consolidates the hybrid reuse strategy and fixes packaging gaps found in v3.

## Added
- Machine-readable registries and schemas included in the ZIP.
- Zero-dependency NodeJS source scripts included in `tools/`.
- Four-level reuse model: Template, Standard, Pattern Pack, Capability Pack.
- Reuse Decision Engine (`reuse:assess`).
- Capability detection workflow before module/feature decomposition.
- Reference AUTH Capability Pack.
- Reference COMMON CRUD Pattern Pack.
- Preview-first import, pack review, lock/snapshot/proposal model and three-way upgrade commands.
- Static documentation site generated from the actual packaged sources.

## Packaging guarantee
The final ZIP is re-extracted into a clean directory and `npm run docs:all` is executed against the extracted copy before delivery.
