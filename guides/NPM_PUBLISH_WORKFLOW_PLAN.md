# npm publishing workflow plan

## Goal

Add a dedicated GitHub Actions workflow that validates `mazey-element-ui` and publishes an unpublished package version to the public npm registry from `release/v2`. Support automatic publication after a push and controlled publication through `workflow_dispatch` without changing package metadata, creating Git tags, publishing to GitHub Packages, or deploying documentation.

Also update the existing GitHub Pages workflow to the required action versions. Keep npm publication and Pages deployment in separate workflows.

Reference: `../mazey-npm-template/.github/workflows/publish-npm.yml`. Reuse its npm setup pattern, but omit its GitHub Packages publication, package-name rewrite, file restoration, and Git-tag creation.

## Update the GitHub Pages workflow

Update `.github/workflows/validate-and-pages.yml` without changing its events, Node.js 22 runtime, npm commands, job dependency, permissions, concurrency, environment, artifact path, or `release/v2` deployment gate.

Use these actions in this order within the Pages deployment flow:

```yaml
- uses: actions/checkout@v7
- uses: actions/setup-node@v7
- uses: actions/configure-pages@v6
- uses: actions/upload-pages-artifact@v5
- uses: actions/deploy-pages@v5
```

The validation job must also use `actions/checkout@v7` and `actions/setup-node@v7`. Build commands may appear between setup and Pages configuration, but the listed actions must retain their relative order. Keep `pages: write` and `id-token: write` scoped to the deploy job.

## Add the npm publishing workflow

Create `.github/workflows/publish-npm.yml` with global `contents: read` permission and Node.js 22. Do not configure Corepack, another package manager, dependency caching, or a repository-owned installer.

### Events

Configure these events:

- `pull_request` targeting `main` or `release/v2` for validation only;
- `push` to `release/v2` for validation and publication; and
- `workflow_dispatch` for validation and publication when dispatched from `release/v2`.

The publish job must require both an approved event and the exact ref `refs/heads/release/v2`. A manual dispatch from another ref must validate but must not publish.

Use a workflow concurrency group based on the ref, with `cancel-in-progress: false`, so two release runs cannot publish the same version concurrently and an active publication is not canceled midway.

### Validation job

The validation job must:

1. Check out the source with `actions/checkout@v7`.
2. Set up Node.js 22 with `actions/setup-node@v7`.
3. Run `npm install`.
4. Run `npm run release:check`.

`release:check` remains the single validation contract. It already covers linting, repository-policy tests, the browser suite, package builds, the Pages build, installed-consumer checks, and the npm pack dry run.

### Publish job

The publish job must:

1. Depend on the successful validation job.
2. Run only for a `release/v2` push or a `workflow_dispatch` from `release/v2`.
3. Use a protected `npm` GitHub environment.
4. Check out the source with `actions/checkout@v7`.
5. Set up Node.js 22 with `actions/setup-node@v7` and `registry-url: https://registry.npmjs.org/`.
6. Run `npm install`.
7. Fail before building when `name@version` from `package.json` already exists on npm.
8. Run `npm run dist` from the clean checkout to create the publishable files.
9. Run `npm publish --access public`.

Expose `secrets.NPM_TOKEN` only as `NODE_AUTH_TOKEN` on the publish step. Do not place it at workflow, job, setup, install, version-check, or build scope. The workflow needs no `contents: write`, `packages: write`, or Pages permissions.

The workflow must not mutate or commit `package.json`, create or push Git tags, create GitHub releases, write a project `.npmrc`, publish to GitHub Packages, or invoke `deploy:build` in the publish job.

## Extend policy tests

Update `test/project-config.test.js` to read both workflow files and protect these contracts:

- Pages uses `actions/checkout@v7`, `actions/setup-node@v7`, `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`, and `actions/deploy-pages@v5` in order.
- Both workflows use Node.js 22, `npm install`, and no package-manager bootstrap or dependency cache.
- The publish workflow validates pull requests but never publishes them.
- Publication requires a successful validation job, an approved event, and `refs/heads/release/v2`.
- The publish setup targets `https://registry.npmjs.org/` and rejects an already-published version.
- `NPM_TOKEN` appears exactly once and only in the `npm publish` step as `NODE_AUTH_TOKEN`.
- The publish workflow retains read-only repository permission and requests no package, Pages, or Git write permission.
- The workflow contains no GitHub Packages registry, metadata rewrite, tag, release, push, or documentation-deployment commands.

Keep the existing Pages permission and concurrency assertions. Prefer structural assertions around jobs and steps instead of broad string checks that could pass when a value appears in the wrong scope.

## Configure npm publication

Before enabling publication:

1. Create the `npm` GitHub environment.
2. Restrict the environment to the `release/v2` branch and add any required reviewer protection.
3. Add `NPM_TOKEN` as an environment secret. Use an npm token authorized to publish `mazey-element-ui` and no unrelated packages.
4. Set `package.json` to the intended unpublished version before pushing or dispatching the workflow.

npm rejects an existing `name@version`; the workflow must report that condition before the build and publish steps.

## Validate the implementation

Run the focused policy test, then the complete non-publishing pipeline:

```bash
npm run test:project
npm run release:check
git diff --check
git status --short
```

Review both workflow diffs and confirm that pull requests stop after validation, a manual run from a non-release ref cannot publish, Pages still deploys only after successful validation on a `release/v2` push, and no local validation command publishes a package or changes external state.
