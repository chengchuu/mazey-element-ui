# Project takeover and GitHub Pages migration

## Goal

Convert the archived Element UI 2.15.14 checkout into the maintained `mazey-element-ui` fork. Prepare version 2.15.15, modernize development for Node.js 22, and deploy the documentation site to:

```text
https://chengchuu.github.io/mazey-element-ui/
```

The migration must preserve the Vue 2 runtime API. Keep `El*` component names, `el-*` CSS classes, `$ELEMENT`, the `ELEMENT` browser global, and the existing `ElementUI` TypeScript symbols.

This work prepares the release but does not publish it to npm.

## Use pnpm locally and npm for commands

Use pnpm for local dependency operations. Use npm for development scripts, GitHub Actions,
registry operations, and package-artifact checks:

- Remove `yarn.lock` and all Yarn-specific commands.
- Preserve the established lockfile policy unless dependency maintenance explicitly changes it.
- Do not add a `packageManager` field, Corepack bootstrap, or a repository-owned package-manager installer.
- Use `pnpm install`, `pnpm add`, `pnpm update`, and `pnpm remove` for local dependency operations.
- Use npm for scripts, builds, tests, and local development commands.
- Install dependencies with `npm install` in CI without dependency caching.
- Do not use `npm ci` in CI.
- Run package scripts with `npm run <script>` in CI.
- Inspect published package metadata with `npm view`.
- Inspect the release artifact with `npm pack --dry-run`.
- Install the packed tarball in a clean npm consumer.
- Use npm for a future publish only after separate authorization.

Document the npm consumer installation command:

```bash
npm install mazey-element-ui
```

## Change the project identity

Update the root package metadata to use:

- Package: `mazey-element-ui`
- Version: `2.15.15`
- Repository: `https://github.com/chengchuu/mazey-element-ui`
- Issues: `https://github.com/chengchuu/mazey-element-ui/issues`
- Homepage: `https://chengchuu.github.io/mazey-element-ui/`

Replace maintained install, import, deep-import, CDN, source, contribution, and documentation links with the fork equivalents. Change internal `element-ui/...` imports, Webpack aliases, externals, generators, tests, and examples to `mazey-element-ui/...` so the packed source does not require the upstream package.

Do not rewrite historical issue and pull-request citations. Preserve the upstream license, Git history, attribution, and links to independent Element ecosystem projects. Describe Mazey Element UI as a maintained fork rather than the original Element UI project.

## Modernize the build for Node.js 22

Keep Vue 2.5 and the existing library output filenames and exports. Upgrade only the development dependencies required for a supported Node.js 22 build:

1. Replace `node-sass` with Dart Sass and update incompatible SCSS syntax.
2. Move the build to Webpack 5 and compatible versions of Babel, Vue Loader, CSS/Sass loaders, the development server, and Karma integration.
3. Replace `file-loader` and `url-loader` with Webpack asset modules.
4. Replace obsolete JavaScript and CSS minimizers with supported Webpack 5 plugins.
5. Remove `eslint-loader`; run linting as an independent check before builds.
6. Preserve UMD, CommonJS, per-component, locale, declaration, and Theme Chalk outputs.
7. Replace upstream-targeting release commands with a non-publishing `release:check` pipeline.

Review peer-dependency warnings instead of bypassing them globally.

## Prepare the Pages site

Build the documentation artifact with `/mazey-element-ui/` as its public base path. Asset, version, and resource requests must resolve beneath that path. Remove the obsolete custom-domain `CNAME` behavior and add `.nojekyll` to the artifact.

Publish only the current 2.15.15 documentation. Remove the historical-version selector because the fork does not host the old version directories.

Remove these upstream-controlled integrations:

- Google Analytics property and all `ga` calls
- Private-network image probe
- Algolia search UI, credentials, index builder, and dependencies
- Online theme editor backed by `element-api.ele.me`

Keep the static theming documentation. Bundle Vue, Vue Router, and Highlight.js into the Pages artifact so the site does not depend on Element-hosted CDN assets. Continue to externalize Vue from distributable library bundles.

Add canonical and social metadata for the new Pages URL. Update Web Types documentation URLs and the maintained README and footer links.

## Replace deployment automation

Remove the obsolete Travis, upstream `gh-pages`, FaaS, and Surge deployment paths. Add GitHub Actions workflows with these branch roles:

- `main`: build and validation only
- `release/v2`: build, validation, and production Pages deployment

Validate pushes and pull requests for both branches on Node.js 22. In GitHub Actions, use `npm install` and `npm run <script>` without package-manager setup or dependency caching.

Deploy the generated artifact through `actions/configure-pages@v5`, `actions/upload-pages-artifact@v4`, and `actions/deploy-pages@v5`. Grant only `contents: read`, `pages: write`, and `id-token: write`. Use the `github-pages` environment and restrict production deployment to `release/v2`.

The existing `origin/release` branch is not a deployment source. Create and push `release/v2` only after the takeover changes pass validation and separate Git authorization is provided.

## Validate the migration

Run the following repository checks on Node.js 22:

```bash
pnpm install
npm run lint
npm test
npm run dist
npm run docs
npm run release:check
npm pack --dry-run
git diff --check
git status --short
```

Inspect the packed file list, then install the tarball into a clean npm consumer project. Verify full-package imports, per-component imports, Theme Chalk CSS, declarations, the browser global, and server-side loading.

Serve the generated site beneath `/mazey-element-ui/` and verify:

- All four languages and hash routes load.
- JavaScript, CSS, fonts, images, and `versions.json` stay under the project base path.
- Direct refreshes and responsive navigation work.
- The site presents only version 2.15.15.
- No request targets legacy analytics, Algolia, private probes, Element CDN assets, or the theme API.
- Maintained links use the fork, while intentional historical upstream citations remain intact.

Review the complete diff and generated-file boundaries before handoff. Do not stage, commit, push, activate Pages, or publish the npm package without explicit authorization.
