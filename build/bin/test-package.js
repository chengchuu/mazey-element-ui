'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '../..');
const packageJson = require(path.join(rootDir, 'package.json'));
const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mazey-element-ui-'));

function run(command, args, cwd, options = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit',
    env: Object.assign({}, process.env, {
      npm_config_cache: path.join(temporaryDir, 'npm-cache')
    }, options.env)
  });

  if (result.status !== 0) {
    if (options.capture) {
      process.stderr.write(result.stdout || '');
      process.stderr.write(result.stderr || '');
    }
    throw new Error(`${command} ${args.join(' ')} failed with status ${result.status}`);
  }

  return result.stdout;
}

function writeConsumer(directory, archivePath) {
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'package.json'), JSON.stringify({
    private: true,
    packageManager: packageJson.packageManager,
    dependencies: {
      [packageJson.name]: `file:${archivePath}`,
      vue: '2.5.21'
    }
  }, null, 2));
}

function verifyRuntime(directory) {
  const runtimeCheck = [
    "process.env.VUE_ENV = 'server'",
    "const assert = require('assert')",
    `const ElementUI = require('${packageJson.name}')`,
    `const Button = require('${packageJson.name}/lib/button')`,
    `const packageMetadata = require('${packageJson.name}/package.json')`,
    "assert.strictEqual(ElementUI.version, '2.15.15')",
    "assert.strictEqual(ElementUI.Button.name, 'ElButton')",
    "assert.strictEqual(Button.name, 'ElButton')",
    "assert.strictEqual(packageMetadata.style, 'lib/theme-chalk/index.css')",
    "assert.strictEqual(packageMetadata.typings, 'types/index.d.ts')",
    `const stylePath = require.resolve('${packageJson.name}/lib/theme-chalk/index.css')`,
    'assert(stylePath)',
    "const path = require('path')",
    "const fs = require('fs')",
    'const fontDir = path.join(path.dirname(stylePath), \'fonts\')',
    "assert(fs.statSync(path.join(fontDir, 'element-icons.ttf')).size > 1000)",
    "assert(fs.statSync(path.join(fontDir, 'element-icons.woff')).size > 1000)",
    'process.exit(0)'
  ].join(';');

  run(process.execPath, ['-e', runtimeCheck], directory);
}

try {
  const packOutput = run('npm', ['pack', '--json', '--pack-destination', temporaryDir], rootDir, { capture: true });
  const archiveName = JSON.parse(packOutput)[0].filename;
  const archivePath = path.join(temporaryDir, archiveName);
  assert(fs.existsSync(archivePath), 'npm pack did not produce an archive');

  const npmConsumer = path.join(temporaryDir, 'npm-consumer');
  writeConsumer(npmConsumer, archivePath);
  console.log('Installing the npm consumer...');
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], npmConsumer);
  verifyRuntime(npmConsumer);

  const pnpmConsumer = path.join(temporaryDir, 'pnpm-consumer');
  writeConsumer(pnpmConsumer, archivePath);
  console.log('Installing the pnpm consumer...');
  run('corepack', ['pnpm', 'install', '--ignore-scripts'], pnpmConsumer);
  verifyRuntime(pnpmConsumer);

  const typeSource = [
    "import Vue from 'vue';",
    `import ElementUI, { Button, Message } from '${packageJson.name}';`,
    'Vue.use(ElementUI);',
    'Vue.component(Button.name, Button);',
    "Message.success('ready');"
  ].join('\n');
  fs.writeFileSync(path.join(pnpmConsumer, 'index.ts'), typeSource);
  fs.writeFileSync(path.join(pnpmConsumer, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      module: 'commonjs',
      noEmit: true,
      strict: true,
      target: 'es2018'
    },
    files: ['index.ts']
  }, null, 2));
  run(path.join(rootDir, 'node_modules/.bin/tsc'), ['--project', 'tsconfig.json'], pnpmConsumer);

  const browserBundle = fs.readFileSync(path.join(rootDir, 'lib/index.js'), 'utf8');
  const vm = require('vm');
  const noop = () => {};
  const browserContext = {
    Vue: require(path.join(rootDir, 'node_modules/vue')),
    console: { warn: noop },
    setTimeout,
    clearTimeout,
    addEventListener: noop,
    removeEventListener: noop,
    navigator: { userAgent: 'package-smoke-test' },
    document: {
      addEventListener: noop,
      removeEventListener: noop,
      createElement: () => ({ style: {} }),
      documentElement: { style: {} }
    }
  };
  browserContext.window = browserContext;
  browserContext.self = browserContext;
  vm.runInNewContext(browserBundle, browserContext);
  assert.strictEqual(browserContext.ELEMENT.Button.name, 'ElButton');

  console.log('npm, pnpm, CommonJS, deep import, CSS, types, and browser-global package checks passed.');
} finally {
  fs.rmSync(temporaryDir, { recursive: true, force: true });
}

process.exit(0);
