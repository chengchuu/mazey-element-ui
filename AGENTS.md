# Repository Guide

## Scope and compatibility

`mazey-element-ui` is the maintained Element UI 2.x fork. It preserves the Vue 2 public contract, including `El*` component names, `el-*` CSS classes, `$ELEMENT`, the browser global `ELEMENT`, and the existing `ElementUI` TypeScript names. Source changes must remain compatible with Vue `^2.5.17` unless the task explicitly changes that contract.

Development requires Node.js 22 and pnpm 11.9.0. The `packageManager` field and `pnpm-lock.yaml` are authoritative. Do not add npm or Yarn lockfiles.

## Repository map

- `packages/<component>/` owns public components and Theme Chalk source. Root `lib/` and `packages/theme-chalk/lib/` are generated.
- `src/` contains shared utilities, locale support, directives, mixins, transitions, and the generated full-library entry at `src/index.js`.
- `types/` defines the public TypeScript contract; keep it aligned with runtime APIs.
- `components.json` drives component entry and stylesheet generation.
- `examples/` contains the Vue 2 documentation SPA, localized Markdown, templates, and local assets. `examples/element-ui/` is the generated GitHub Pages artifact.
- `test/unit/specs/` contains Karma/Mocha browser tests. `test/ssr/` covers server-side loading.
- `build/` contains generators, Webpack 5 configurations, Markdown loaders, package smoke tests, and Pages finalization.

## Commands and build ownership

- `pnpm dev` regenerates source-derived files and starts the documentation server.
- `pnpm run build:file` regenerates `src/index.js` and localized page shells.
- `pnpm run dist` creates the npm artifacts with Webpack, Babel, and Dart Sass.
- `pnpm run deploy:build` creates the subpath-safe Pages artifact in `examples/element-ui/` and adds crawler files plus `.nojekyll`.
- `pnpm test` runs the browser suite; `pnpm run test:package` verifies packed npm and pnpm consumers, CommonJS, deep imports, CSS, declarations, and the browser global.
- `pnpm run release:check` runs the complete non-publishing release validation.

Do not hand-edit `src/index.js`, generated localized pages, `lib/`, `packages/theme-chalk/lib/`, or `examples/element-ui/`. Change their source, template, or generator and rebuild. Do not restore the retired online theme editor, private service probes, analytics, or CDN-loaded documentation runtime dependencies.

## Documentation and Pages

The public site is hosted at `https://chengchuu.github.io/mazey-element-ui/`; browser-loaded project assets must remain below `/mazey-element-ui/`. Vue, Vue Router, Highlight.js, documentation scripts, styles, fonts, and images are bundled or copied locally. Preserve upstream issue and release links when they are historical citations, while maintained package, repository, issue, contribution, and installation links must use `mazey-element-ui`.

The validation workflow runs on `main` and `release/v2`. GitHub Pages deployment is restricted to pushes to `release/v2`; local work must not publish, deploy, tag, stage, or commit unless explicitly requested.

## Change and validation guidance

Keep changes narrow and preserve the Vue 2 API. Update implementation, declarations, tests, documentation, and examples together when public behavior changes. Start with focused checks, then run the applicable full commands:

```bash
corepack pnpm install --frozen-lockfile
pnpm run lint
pnpm test
pnpm run dist
pnpm run deploy:build
pnpm run test:package
npm pack --dry-run
git diff --check
```

Review `git status --short` and generated artifacts before handoff. Dart Sass may report upstream `@import` and legacy-function deprecations; do not silence them by changing package CSS behavior incidentally.
