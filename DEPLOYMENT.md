# Deployment

https://angular.bd will be hosted on Firebase Hosting (project: `angular-bn`).

[`adev-production-deploy.yml`](./.github/workflows/adev-production-deploy.yml)
builds and deploys on every push to `main`. It needs the `FIREBASE_SERVICE_ACCOUNT`
repository secret (a Firebase Hosting service account JSON for the `angular-bn`
project); until that exists the deploy step fails and the site can be deployed
manually:

```sh
pnpm build
npx firebase-tools deploy --only hosting
```

[`update-origin.yml`](./.github/workflows/update-origin.yml) bumps the `origin`
submodule to the latest upstream main every Monday and opens a PR; diffs against
`.en.*` snapshots in that PR show which translations went stale.

[`sync-untranslated-issue.yml`](./.github/workflows/sync-untranslated-issue.yml)
keeps a tracking issue listing every untranslated file with claim links.
