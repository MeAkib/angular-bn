# angular-bn — Angular বাংলা

Repository for the Bangla (বাংলা) localization of [angular.dev](https://angular.dev),
the official Angular documentation. Hosted at **https://angular.bd** (coming soon).

এই রিপোজিটরিটি Angular-এর অফিসিয়াল ডকুমেন্টেশন [angular.dev](https://angular.dev)-এর
বাংলা অনুবাদের জন্য। অনূদিত সাইট: **https://angular.bd** (শীঘ্রই আসছে)।

Untranslated pages remain the English original, so the site is always complete even
while translation is in progress.

## How it works

- The English source ([angular/angular](https://github.com/angular/angular)) is pinned
  as a git submodule at [`origin`](./origin).
- Translations live in [`adev-bn/`](./adev-bn), mirroring `adev/` paths in the submodule.
  `pnpm update-origin` fills it with an English copy of every translatable file;
  translating a file means duplicating it as an `xxx.en.md` snapshot and rewriting the
  `xxx.md` in Bangla. The snapshot is used to detect when upstream changes make a
  translation stale.
- `pnpm build` copies the submodule into `build/`, overlays `adev-bn/`, applies the
  patches in [`tools/adev-patches/`](./tools/adev-patches), and builds adev with Bazel.

## Development

```sh
pnpm install
pnpm build        # full build (first run syncs the submodule; takes a while)
pnpm start        # dev server at http://localhost:4200, watches adev-bn/
pnpm lint         # textlint + prh terminology checks on translated files
```

On macOS, copy `.bazelrc.user.example` to `.bazelrc.user` first.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) and the [glossary](./GLOSSARY.md).
Claim a page via a "Translation Checkout" issue before you start translating it.

## Credits

This project's tooling and structure are adapted from
[angular/angular-ja](https://github.com/angular/angular-ja) (MIT), the Japanese
localization by the Angular Japan community. অসংখ্য ধন্যবাদ 🙏
