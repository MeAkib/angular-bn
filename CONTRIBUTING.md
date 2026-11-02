# Contributing to angular-bn

Thank you for helping translate the Angular docs into Bangla! ❤️

## Before you start

1. Check the issues labeled **"type: Translation Checkout"** so two people don't
   translate the same page.
2. Open a new "Translation Checkout" issue for the page you want to translate,
   titled `translate: {file path}` (e.g. `translate: guide/signals/overview`).
3. Read [GLOSSARY.md](./GLOSSARY.md) — it decides how technical terms are written.
   CI enforces some of it via `pnpm lint` (textlint + prh).

## Setup

```sh
git clone --recursive https://github.com/MeAkib/angular-bn.git
cd angular-bn
pnpm install
pnpm build          # first build: syncs the origin submodule and builds adev
pnpm start          # dev server at http://localhost:4200
```

On macOS, copy `.bazelrc.user.example` to `.bazelrc.user` before building.

## Translating a page

The overlay directory `adev-bn/` mirrors `adev/` paths in the `origin` submodule and
already contains an English copy of every translatable file (kept in sync by
`pnpm update-origin`). Most pages are Markdown under `adev-bn/src/content/`.

1. Find the page's English copy under `adev-bn/` (e.g.
   `adev-bn/src/content/guide/signals/overview.md`).
2. Duplicate it next to itself with an `.en` suffix before the extension
   (`overview.md` → `overview.en.md`). The `.en.md` file is the frozen English
   snapshot — never edit it; it marks the file as translated and is how we detect
   stale translations later.
3. Translate the `.md` file (without the `.en`) into Bangla.
   - Keep the **same number of lines** as the English file, so diffs stay reviewable.
   - Don't translate code blocks, URLs, file names, or identifiers.
   - Keep callout prefixes in English: `NOTE:`, `TIP:`, `IMPORTANT:`, etc.
   - For `##` and deeper headings, append an anchor with the original English id:
     `## সিগন্যাল কী? {#what-are-signals}` — this keeps deep links from the English
     site working.
4. Run `pnpm lint` (add `--fix` for auto-fixes) and `pnpm start` to preview.
5. Open a pull request. CI runs lint, patch checks, and a full build.

AI-assisted translation is available: see [docs/TRANSLATION_WITH_AI.md](./docs/TRANSLATION_WITH_AI.md).

## Fixing an existing translation

For small fixes (typos, wording), GitHub's "Edit this file" flow is enough — edit the
`.md` file, never the `.en.md` snapshot.

## Updating from upstream

`pnpm update-origin` bumps the `origin` submodule and re-copies files whose English
source changed, so the diff against each `.en.md` snapshot shows what needs
re-translating. Maintainers run this regularly.

## Style

- Register: formal (আপনি), consistent across the whole site.
- Keep sentences short; prefer plain Bangla over heavy সাধু ভাষা.
- See [GLOSSARY.md](./GLOSSARY.md) for term-by-term decisions.
