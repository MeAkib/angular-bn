# AGENTS.md

Guide for AI agents working in this repository (angular-bn, the Bangla localization
of angular.dev).

## What this repo is

- `origin/` is a git submodule pinning [angular/angular](https://github.com/angular/angular);
  it is the English source of truth. Never edit files inside `origin/`.
- `adev-bn/` is the translation overlay, mirroring `adev/` paths in the submodule.
  `xxx.en.md` is a frozen English snapshot; `xxx.md` is its Bangla translation.
  Edit only the `.md` files, never the `.en.md` snapshots.
- `tools/adev-patches/` holds patches applied to the copied origin at build time.
- `build/` is generated; never edit it.

## Commands

- `pnpm install` — install dependencies.
- `pnpm build` — sync submodule, overlay, patch, and build adev with Bazel (slow).
- `pnpm start` — dev server at http://localhost:4200, watching `adev-bn/`.
- `pnpm lint [--fix]` — textlint + prh terminology checks on translated files.
- `pnpm test` / `test:unit` / `test:routes` — patch check, tool unit tests, route check.

## Translation rules

- Follow [GLOSSARY.md](./GLOSSARY.md) for terminology; formal register (আপনি).
- Keep the translated file's line count identical to its `.en.md` snapshot.
- Don't translate code blocks, URLs, identifiers, or callout prefixes (`NOTE:`, `TIP:`...).
- For `##` and deeper headings, append `{#original-english-anchor}`.
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full workflow.
