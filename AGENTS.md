# Repository Guide

## Project contract

`mazey-element-ui` is a maintained fork of Element UI 2.15.14 for Vue 2 desktop applications. `package.json` owns the release version, and `npm run build:file` copies it into the generated runtime entry. CI and maintained development documentation use Node.js 22, but the package manifest intentionally declares no `engines` range. Preserve its Vue `^2.5.17` peer contract and established public surface unless a task explicitly authorizes a breaking change:

- `El*` component names and `el-*` CSS classes;
- the default plugin, named component exports, `$ELEMENT`, and service APIs;
- CommonJS at `lib/element-ui.common.js`, UMD at `lib/index.js`, and the browser global `ELEMENT`;
- Theme Chalk at `lib/theme-chalk/index.css` and declarations at `types/index.d.ts`;
- supported deep imports below `lib/`.

Use npm for repository commands and GitHub Actions. `pnpm-lock.yaml` is the committed dependency-resolution snapshot, but npm remains the command runner. Do not add a `packageManager` pin, Corepack bootstrap, repository-owned installer, dependency cache, or workspace configuration unless a task explicitly changes that policy. `package-lock.json` is intentionally ignored.

## Repository map

- `components.json` is the component registry used by entry and stylesheet generators.
- `packages/<component>/` contains public Vue components. `packages/theme-chalk/src/` owns the Sass theme and font sources.
- `src/` contains shared locale, directive, mixin, transition, and utility code. `src/index.js` is generated from `components.json`.
- `types/` defines the public TypeScript contract; update it with any public runtime change.
- `examples/` is the Vue 2 documentation and component-demo SPA. It uses hash routing and must remain usable below `/mazey-element-ui/`.
- `guides/` contains planning and reference notes. Treat implementation plans as historical intent when the live scripts, workflows, or package metadata differ.
- `test/unit/specs/` contains the Karma, Mocha, and ChromeHeadless browser suite. `test/project-config.test.js` protects repository and workflow policy, while `build/bin/test-package.js` validates an installed package consumer. `test/ssr/require.test.js` is a standalone built-bundle probe and is not invoked by a package script.
- `build/` contains the Babel and Webpack 5 configurations, Markdown loader, source generators, package builders, Pages finalizer, and pack checks.
- `.github/workflows/validate-and-pages.yml` validates `main` and `release/v2`; only a push to `release/v2` deploys Pages.
- `.github/workflows/publish-npm.yml` validates pull requests and release runs; only an eligible `release/v2` push or manual dispatch can publish to npm.

## Entry points and data flow

- Package consumers enter through `package.json`: `main` resolves to the generated CommonJS bundle, `unpkg` resolves to the UMD bundle, `style` resolves to Theme Chalk, and `typings` resolves to `types/index.d.ts`. `components.json` also drives the supported per-component bundles below `lib/`.
- `build/bin/build-entry.js` reads `components.json` and the package version to generate `src/index.js`. Its `install` function registers components, the infinite-scroll and loading directives, `$ELEMENT`, and the loading, message-box, notification, and message services on Vue.
- Components exchange application data through Vue props, events, slots, `provide`/`inject`, and the `src/mixins/emitter.js` dispatch/broadcast helpers. `src/locale/` owns active translations, while `src/utils/popup/popup-manager.js` coordinates overlay instances, modal state, and z-index allocation.
- The documentation SPA starts at `examples/entry.js`, installs the generated full-library entry and Vue Router, registers documentation layout components, and mounts `examples/app.vue`. `examples/route.config.js` derives lazy hash routes from `examples/nav.config.json`, generated page shells, and maintained Markdown below `examples/docs/`; route changes update syntax highlighting, document titles, and the active locale.
- `build/webpack.demo.js` bundles the documentation SPA into `examples/element-ui/`. `build/bin/finalize-pages.js` then adds `.nojekyll`, `robots.txt`, and the root-only sitemap used by GitHub Pages.

## Generated files and build ownership

Do not hand-edit generated output. Change the owning source, template, registry, or script and regenerate it.

- `npm run build:file` generates `src/index.js`, icon metadata, and localized files below `examples/pages/{en-US,zh-CN,es,fr-FR}/`.
- `npm run build:theme` regenerates `packages/theme-chalk/src/index.scss`, compiles Theme Chalk, and copies its CSS and fonts into `lib/theme-chalk/`.
- `npm run dist` cleans and rebuilds `lib/` and `packages/*/lib/` with Webpack, Babel, Gulp, and Dart Sass.
- `npm test` rebuilds Theme Chalk and may create `dist/` plus coverage output.
- `npm run deploy:build` recreates `examples/element-ui/`, then adds `.nojekyll`, `robots.txt`, and a root-only `sitemap.xml`.

The generated and ignored boundaries include `lib/`, `/dist/`, `packages/*/lib/`, `test/**/coverage`, localized generated page directories, and `examples/element-ui/`. The npm allowlist intentionally publishes `lib/`, `src/`, `packages/`, `types/`, and `web-types.json`; source changes in those directories can therefore affect consumers even when they are not package entry points.

## Development commands

```bash
npm install
npm run dev          # Build source-derived files and serve docs on port 8085
npm run dev:play     # Serve the component playground entry
npm run build:file   # Regenerate source and localized documentation files
npm run build:theme  # Regenerate and compile Theme Chalk
npm run lint         # Lint src, test, packages, and build
npm test             # Run the single-pass browser suite
npm run test:watch   # Run the browser suite in watch mode
npm run test:project # Run repository-policy regressions
npm run dist         # Build all publishable package artifacts
npm run deploy:build # Build the GitHub Pages artifact
npm run test:package # Pack, install, and verify an npm consumer
npm run pack:check   # Inspect the npm archive with a dry run
npm run release:check
```

`npm run release:check` is the complete non-publishing validation chain: lint, project-policy tests, browser tests, package build, Pages build, installed-consumer checks, and the pack dry run. The package smoke test covers CommonJS, a component deep import, Theme Chalk and fonts, TypeScript declarations, and the UMD browser global.

## Documentation and GitHub Pages

The public site is `https://chengchuu.github.io/mazey-element-ui/`. Keep Webpack `publicPath`, favicon and navigation URLs, canonical metadata, crawler files, and copied assets below `/mazey-element-ui/`. The site is a single hash-routed SPA, so the stable crawlable URL and sitemap entry are the project root; language and component views remain hash routes.

Keep maintained package, repository, issue, contribution, installation, and release links on `mazey-element-ui`. Preserve upstream Element UI links when they are historical citations or attribution. Do not restore the retired online theme editor, private service probes, analytics, or CDN-loaded documentation runtime dependencies.

GitHub Actions uses Node.js 22, installs with `npm install`, and explicitly disables dependency caching. Validation and publication use `actions/checkout@v7` and `actions/setup-node@v7`; Pages deployment additionally uses `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`, and `actions/deploy-pages@v5`. Both workflows keep repository permissions read-only unless a deployment job needs narrower additional permissions.

The Pages workflow validates pushes and pull requests for `main` and `release/v2`, plus manual dispatches. Its deploy job owns `pages: write` and `id-token: write`, uses the non-canceling `pages` concurrency group, uploads `examples/element-ui/`, and runs only after successful validation on a push to `release/v2`.

The npm workflow validates pull requests to `main` and `release/v2`, pushes to `release/v2`, and manual dispatches. Publication requires successful validation, the exact `refs/heads/release/v2` ref, and either a push or manual-dispatch event. The protected `npm` environment gates the publish job. Before building, the workflow checks the public npm registry and stops if `name@version` already exists; only an npm `E404` permits `npm run dist` to continue. Other registry failures fail closed. `NPM_TOKEN` is exposed as `NODE_AUTH_TOKEN` only to the final `npm publish --access public` step. The workflow does not rewrite package metadata, publish to GitHub Packages, create tags or releases, or deploy documentation.

Do not publish, deploy, create releases or tags, stage files, or commit changes unless the user explicitly requests the action.

## Change and validation guidance

Keep changes narrow and preserve unrelated work. When public behavior changes, update the implementation, declarations, unit tests, package smoke test, examples, and documentation together. Add components through `components.json` and the established component and type structure; do not manually splice generated registries or bundles.

Start with the most focused relevant check. `test/project-config.test.js` protects the package-manager, Pages, and npm-publication workflow contracts. Before handoff, run the applicable broader checks, then inspect the final diff and generated boundaries:

```bash
npm run lint
npm run test:project
npm test
npm run dist
npm run deploy:build
npm run test:package
npm run pack:check
git diff --check
git status --short
```

Dart Sass can report deprecations from the inherited Theme Chalk source, and the Vue 2 test suite can emit expected framework warnings. Report such warnings separately; do not change public CSS or component behavior merely to silence them.
