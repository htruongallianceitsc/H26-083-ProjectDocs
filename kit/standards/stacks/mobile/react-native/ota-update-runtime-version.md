# OTA Update and Runtime Version Standard

## Concepts
Binary/app version, build number, update channel and `runtimeVersion` are separate concerns.

## Rules
- An update may only target a compatible native runtime.
- Any native dependency/config/plugin change must trigger runtime compatibility review before OTA publication.
- Define development, preview and production channels.
- Production OTA requires rollback strategy and release evidence.
- Define minimum supported binary behavior for server/API changes.
- Emergency updates must not bypass validation of deep links, auth bootstrap and critical startup.

## Required release evidence
Record channel, runtimeVersion, binary version/build, source revision, validation result and rollback target.
