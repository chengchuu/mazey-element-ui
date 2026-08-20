# npm Publishing Workflow Plan

## Goal

Publish `mazey-element-ui` to the public npm registry through GitHub Actions after a successful push to `release/v2`, with a manual-dispatch option for controlled releases.

Reference: `./mazey-npm-template/.github/workflows/publish-npm.yml`

## Workflow Design

Create `.github/workflows/publish-npm.yml` as a dedicated workflow, leaving the existing Pages validation and deployment workflow unchanged.

### Triggers

- Validate pull requests targeting `main` and `release/v2`.
- Publish on pushes to `release/v2`.
- Support `workflow_dispatch` for manual publishing.

### Validation Job

1. Check out the repository.
2. Set up Node.js 22.
3. Run `npm install`.
4. Run `npm run release:check`.

The job uses read-only repository permissions and does not configure dependency caching, Corepack, or another package manager.

### Publish Job

1. Run only after the validation job and only for a `release/v2` push or manual dispatch.
2. Check out the repository and set up Node.js 22 with `https://registry.npmjs.org/` as the npm registry.
3. Run `npm install`.
4. Build publishable artifacts with `npm run dist`.
5. Run `npm publish --access public` using `secrets.NPM_TOKEN`.

The workflow must publish only to npm. It must not publish to GitHub Packages, rewrite `package.json`, create release tags, push Git changes, or deploy documentation.

## Policy Coverage

Extend `test/project-config.test.js` to assert that the publishing workflow:

- uses npm and Node.js 22;
- has no package-manager bootstrap or dependency cache;
- validates pull requests and gates publication to the approved events;
- configures the public npm registry;
- reads `NPM_TOKEN` only in the publish step; and
- does not request unrelated write permissions.

## Release Preconditions

- Configure `NPM_TOKEN` as a repository secret with permission to publish `mazey-element-ui`.
- Increment `package.json` to an unpublished version before triggering a release. npm rejects a version that has already been published.
