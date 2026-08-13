# Mazey Element UI Contributing Guide

Hi! Thank you for choosing Mazey Element UI.

Mazey Element UI is a Vue 2.0 based component library for developers, designers and product managers.

We are excited that you are interested in contributing to Element. Before submitting your contribution though, please make sure to take a moment and read through the following guidelines.

## Issue Guidelines

- Issues are exclusively for bug reports, feature requests and design-related topics. Other questions may be closed directly. If any questions come up when you are using Element, please hit [Gitter](https://gitter.im/element-en/Lobby) for help.

- Before submitting an issue, please check if similar problems have already been issued.

- Please specify which version of `Element` and `Vue` you are using, and provide OS and browser information. [JSFiddle](https://jsfiddle.net/) is recommended to build a live demo so that your issue can be reproduced clearly.

## Pull Request Guidelines

- Fork this repository to your own account. Do not create branches here.

- Commit info should be formatted as `[Component Name]: Info about commit.` (e.g. `Button: Fix xxx bug`)

- **DO NOT** include files inside `lib` directory.

- Make sure that running `pnpm run dist` outputs the correct files.

- Rebase before creating a PR to keep commit history clear.

- Create pull requests against `main`.

- If your PR fixes a bug, please provide a description about the related bug.

- Merging a PR takes two maintainers: one approves the changes after reviewing, and then the other reviews and merges.

## Prerequisites
Node.js 22 and pnpm 11.9.0 are required. The committed `pnpm-lock.yaml` is authoritative.
```shell
git clone https://github.com/chengchuu/mazey-element-ui.git
corepack pnpm install --frozen-lockfile
pnpm run dev

# open http://localhost:8085/mazey-element-ui/
```

> **Notice**: modify `examples/play/index.vue` file, use the component you contribute, then run `pnpm run dev:play`, go ahead [http://localhost:8085](http://localhost:8085), get result, more quickly and friendly.

To build:

```shell
pnpm run dist
```

## Component Developing Guidelines
- Run `make new <component-name>` to create project directory for a new component. Test codes, entry file and documentation are included.
- Refer to `Button` for nested components.
- Refer to `Select` for components that depend on other components.

## Code Style
Just comply with the [ESLint](https://github.com/ElemeFE/eslint-config-elemefe) configuration of [ElemeFE](https://github.com/elemefe).
