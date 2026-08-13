# Repository Guide

## Project contract

`mazey-element-ui` is a maintained fork of Element UI 2.15.14 for Vue 2 desktop applications. The package is currently version 2.15.15 and supports Node.js 22 or later for development. Preserve its Vue `^2.5.17` peer contract and established public surface unless a task explicitly authorizes a breaking change:

- `El*` component names and `el-*` CSS classes;
- the default plugin, named component exports, `$ELEMENT`, and service APIs;
- CommonJS at `lib/element-ui.common.js`, UMD at `lib/index.js`, and the browser global `ELEMENT`;
- Theme Chalk at `lib/theme-chalk/index.css` and declarations at `types/index.d.ts`;
- supported deep imports below `lib/`.

Use npm for repository commands and GitHub Actions. Do not add a package-manager pin, Corepack bootstrap, repository-owned installer, or dependency cache unless a task explicitly changes that policy. `package-lock.json` is intentionally ignored.

## Repository map

- `components.json` is the component registry used by entry and stylesheet generators.
- `packages/<component>/` contains public Vue components. `packages/theme-chalk/src/` owns the Sass theme and font sources.
- `src/` contains shared locale, directive, mixin, transition, and utility code. `src/index.js` is generated from `components.json`.
- `types/` defines the public TypeScript contract; update it with any public runtime change.
- `examples/` is the Vue 2 documentation and component-demo SPA. It uses hash routing and must remain usable below `/mazey-element-ui/`.
- `test/unit/specs/` contains the Karma, Mocha, and ChromeHeadless browser suite. `test/project-config.test.js` protects repository and workflow policy, while `build/bin/test-package.js` validates an installed package consumer.
- `build/` contains the Babel and Webpack 5 configurations, Markdown loader, source generators, package builders, Pages finalizer, and pack checks.
- `.github/workflows/validate-and-pages.yml` validates `main` and `release/v2`; only a push to `release/v2` deploys Pages.

## Generated files and build ownership

Do not hand-edit generated output. Change the owning source, template, registry, or script and regenerate it.

- `npm run build:file` generates `src/index.js`, icon metadata, and localized files below `examples/pages/{en-US,zh-CN,es,fr-FR}/`.
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

GitHub Actions installs with npm and does not use dependency caching. The validation job runs for pushes and pull requests targeting `main` or `release/v2`, plus manual dispatch. The deploy job owns `pages: write` and `id-token: write`, uses the `pages` concurrency group, uploads `examples/element-ui/`, and runs only after validation on a push to `release/v2`.

Do not publish, deploy, create releases or tags, stage files, or commit changes unless the user explicitly requests the action.

## Change and validation guidance

Keep changes narrow and preserve unrelated work. When public behavior changes, update the implementation, declarations, unit tests, package smoke test, examples, and documentation together. Add components through `components.json` and the established component and type structure; do not manually splice generated registries or bundles.

Start with the most focused relevant check. Before handoff, run the applicable broader checks, then inspect the final diff and generated boundaries:

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
