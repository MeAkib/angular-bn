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
- `pnpm list-untranslated` — what still needs translating (`--json` for the raw data).
- `pnpm translate <path>` — Gemini-drafted translation (needs `GOOGLE_API_KEY` in `.env`);
  the output is a draft to review against the glossary, never a finished translation.
- `pnpm update-origin [sha]` — maintainers only: bump the submodule and refresh English copies.
- On macOS, copy `.bazelrc.user.example` to `.bazelrc.user` before building. Never replace
  it with `--spawn_strategy=local`: without the sandbox, tsc project globs pick up
  undeclared files in external repos and the build fails.

## Translating a page

1. The English copy already exists under `adev-bn/` (update-origin puts it there).
2. Duplicate it with an `.en` suffix (`page.md` → `page.en.md`) — the frozen snapshot.
3. Rewrite `page.md` in Bangla, then run `pnpm lint`.

## Translation rules

- Follow [GLOSSARY.md](./GLOSSARY.md) for terminology; formal register (আপনি).
- Keep the translated file's line count identical to its `.en.md` snapshot.
- Don't translate code blocks, URLs, identifiers, or callout prefixes (`NOTE:`, `TIP:`...).
- For `##` and deeper headings, append `{#original-english-anchor}`.
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full workflow.
