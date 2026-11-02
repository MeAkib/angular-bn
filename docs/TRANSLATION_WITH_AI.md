# AI-assisted translation

The `pnpm translate` command drafts Bangla translations with the Gemini API, then runs
textlint/prh and asks the model to fix any terminology violations. **The output is a
draft** — always review it against [GLOSSARY.md](../GLOSSARY.md) before opening a PR.

## Setup

1. Get a Google AI Studio API key.
2. Copy `.env.example` to `.env` and set `GOOGLE_API_KEY=...`
   (optionally `GEMINI_MODEL=...`).

## Usage

```sh
pnpm translate <path or glob>     # preview translation
pnpm translate -w <path>          # write the result (creates the .en.md snapshot too)
pnpm translate --force <path>     # re-translate an already translated file
```

Example:

```sh
pnpm translate -w adev-bn/src/content/introduction/what-is-angular.md
```
