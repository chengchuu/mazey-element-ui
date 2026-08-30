# Mazey Element UI

Mazey Element UI is a maintained fork of Element UI 2.15.14 for Vue 2 desktop applications. Version 2.15.15 preserves the upstream public API. The repository retains upstream history, license, issue references, and contributor attribution.

## Documentation

- [English](https://chengchuu.github.io/mazey-element-ui/#/en-US)
- [简体中文](https://chengchuu.github.io/mazey-element-ui/#/zh-CN)
- [Español](https://chengchuu.github.io/mazey-element-ui/#/es)
- [Français](https://chengchuu.github.io/mazey-element-ui/#/fr-FR)
- [Customize the theme](https://chengchuu.github.io/mazey-element-ui/#/en-US/component/custom-theme)

## Install

Install the package with npm:

```bash
npm install mazey-element-ui
```

Vue 2.5.17 or later is a peer dependency.

## Usage

Register the complete component library:

```js
import Vue from 'vue';
import Element from 'mazey-element-ui';
import 'mazey-element-ui/lib/theme-chalk/index.css';

Vue.use(Element);
```

You can also import individual components:

```js
import Vue from 'vue';
import { Button, Select } from 'mazey-element-ui';

Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
```

See the [quick start](https://chengchuu.github.io/mazey-element-ui/#/en-US/component/quickstart) for locale, on-demand import, and global configuration examples.

## Development

Development requires Node.js 22 and npm.

```bash
npm install
npm run lint
npm test
npm run dist
npm run docs
```

Generated package files in `lib/`, generated theme files, and the Pages artifact in `examples/element-ui/` must be regenerated through their owning scripts.

Read the contributing guide in [English](.github/CONTRIBUTING.en-US.md), [简体中文](.github/CONTRIBUTING.zh-CN.md), [Español](.github/CONTRIBUTING.es.md), or [Français](.github/CONTRIBUTING.fr-FR.md) before opening a pull request.

## Upstream attribution

Element UI was originally developed by Ele.me and its contributors. The upstream repository is archived at [ElemeFE/element](https://github.com/ElemeFE/element). This fork preserves the upstream `LICENSE`, Git history, historical issue and pull-request references, and documentation credits.

English documentation was contributed by SwiftGG Translation Team members raychenfj, kevin, 曾小涛, 湾仔王二, BlooDLine, 陈铭嘉, 千叶知风, 梁杰, Changing, and mmoaay. Spanish documentation contributors include adavie1, carmencitaqiu, coderdiaz, fedegar33, Gonzalo2310, lesterbx, ProgramerGuy, SantiagoGdaR, sigfriedCub1990, and thechosenjuan. French documentation contributors include smalesys and blombard.

## License

[MIT](LICENSE)
