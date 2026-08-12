# Repository Guide

## Scope and Runtime

This is the archived Element UI 2.15.14 source tree: a Vue 2.5 component library built with Webpack 4, Babel 6, Gulp 4, and Yarn Classic. Treat `yarn.lock` as authoritative and use Yarn for dependency changes. The preview workflow records Node 10.15.0; the legacy `node-sass` toolchain may not run on current Node releases without a compatible environment.

## Repository Map and Entry Points

- `packages/<component>/` owns each public component. Its `index.js` installs or exports the implementation under `src/`; colocate component-specific helpers there.
- `src/` contains shared locale, mixin, directive, transition, popup, DOM, and date utilities. `src/index.js` is the generated full-library plugin entry.
- `components.json` maps public component names to package entries and drives entry and stylesheet generation.
- `types/` contains the public TypeScript declarations; keep these aligned with runtime APIs.
- `packages/theme-chalk/src/` is the maintained SCSS theme source. Its `lib/` output and root `lib/` are generated and ignored.
- `examples/` contains the documentation application, Markdown component docs, localized pages, play area, and shared demo UI.
- `test/unit/specs/` contains Karma/Mocha browser tests; `test/ssr/` covers server-side loading.
- `build/` owns generators, Markdown loading, Webpack targets, release scripts, and shared aliases.

## Startup and Data Flow

`npm run dev` installs dependencies, runs `build:file`, starts `webpack-dev-server` on port 8085, and watches page templates. `examples/entry.js` installs Element and Vue Router, builds routes from `examples/nav.config.js`, lazy-loads localized Markdown/pages, and mounts `examples/app.vue` at `#app`. For focused work, edit `examples/play/index.vue` and run `npm run dev:play`.

Consumer data enters components through Vue props, `v-model`, provide/inject, or plugin options. Components derive local state, coordinate through emitted events or shared mixins/utilities, and render DOM. Services such as Message create Vue instances imperatively and attach them to `document.body`; popup utilities coordinate stacking. Theme SCSS supplies the matching `el-*` classes.

## Configuration and Build Pipeline

`package.json` defines the workflow; `.babelrc`, `.eslintrc`, `build/config.js`, and `build/webpack.*.js` control transpilation, linting, aliases, externals, and outputs. `npm run build:file` regenerates `src/index.js`, localized page shells, and version data. `npm run dist` cleans outputs, regenerates files, lints, builds UMD/CommonJS/per-component bundles, transpiles shared utilities, emits locale UMD files, and compiles/minifies Theme Chalk.

Do not hand-edit generated entries or `lib/`. Update `components.json`, templates, package source, declarations, docs, and tests together. Validate focused changes with the relevant unit spec, then run `npm run lint`, `npm test`, and `npm run dist` when the compatible legacy runtime is available. Finish with `git diff --check` and inspect `git status --short`.
