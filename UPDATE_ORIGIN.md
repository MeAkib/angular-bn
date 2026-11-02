# Updating the origin submodule

`origin` pins [angular/angular](https://github.com/angular/angular) at the commit the
current translations were checked against.

To update:

```sh
pnpm update-origin           # bumps the submodule and re-copies changed English files
pnpm build                   # verify patches still apply and the site builds
pnpm list-untranslated       # see what's new/stale
```

After an update, diff each translated page's `.en.md` snapshot against the new English
source to find translations that need refreshing. If a patch in `tools/adev-patches/`
no longer applies, re-create it against the new origin (see the patch files for the
upstream files they touch).
