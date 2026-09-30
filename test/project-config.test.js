'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const rootDir = path.resolve(__dirname, '..');
const packageJson = require('../package.json');
const pagesWorkflow = fs.readFileSync(path.join(rootDir, '.github/workflows/validate-and-pages.yml'), 'utf8');
const publishWorkflow = fs.readFileSync(path.join(rootDir, '.github/workflows/publish-npm.yml'), 'utf8');
const makefile = fs.readFileSync(path.join(rootDir, 'Makefile'), 'utf8');

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function getJob(workflow, name) {
  const marker = `  ${name}:`;
  const start = workflow.indexOf(marker);
  assert.notStrictEqual(start, -1, `Missing workflow job: ${name}`);
  const remainder = workflow.slice(start + marker.length);
  const nextJob = remainder.search(/\n {2}[\w-]+:\n/);
  return nextJob === -1 ? workflow.slice(start) : workflow.slice(start, start + marker.length + nextJob);
}

function getNamedStep(job, name) {
  const marker = `      - name: ${name}`;
  const start = job.indexOf(marker);
  assert.notStrictEqual(start, -1, `Missing workflow step: ${name}`);
  const remainder = job.slice(start + marker.length);
  const nextStep = remainder.search(/\n {6}- (?:name|uses|run):/);
  return nextStep === -1 ? job.slice(start) : job.slice(start, start + marker.length + nextStep);
}

function getActions(source) {
  return Array.from(source.matchAll(/^\s+(?:- )?uses: ([^\s]+)$/gm), match => match[1]);
}

test('repository keeps local pnpm unpinned and GitHub Actions npm-only', () => {
  assert.strictEqual(packageJson.packageManager, undefined);
  assert.strictEqual(packageJson.scripts.bootstrap, undefined);
  for (const workflow of [pagesWorkflow, publishWorkflow]) {
    assert.doesNotMatch(workflow, /pnpm\/action-setup|corepack|npm ci|cache:\s*(?:npm|pnpm)/);
  }
  assert.strictEqual(fs.existsSync(path.join(rootDir, 'pnpm-lock.yaml')), true);
  assert.strictEqual(fs.existsSync(path.join(rootDir, 'pnpm-workspace.yaml')), true);
});

test('clean removes every generated package and test output boundary', () => {
  const generatedPaths = [
    'lib',
    'dist',
    'packages/*/lib',
    'test/**/coverage',
    'examples/icon.json',
    'examples/element-ui',
    'examples/pages/en-US',
    'examples/pages/zh-CN',
    'examples/pages/es',
    'examples/pages/fr-FR'
  ];

  for (const generatedPath of generatedPaths) {
    assert.match(packageJson.scripts.clean, new RegExp(`(?:^|\\s)${generatedPath.replace(/[*/]/g, '\\$&')}(?:$|\\s)`));
  }
});

test('package runtime does not duplicate the package metadata version', () => {
  const sourceEntry = read('src/index.js');
  const packageSmokeTest = read('build/bin/test-package.js');

  assert.doesNotMatch(sourceEntry, /^\s*version:/m);
  assert.doesNotMatch(packageSmokeTest, /ElementUI\.version/);
});

test('composite scripts use npm for nested package scripts', () => {
  const compositeScripts = ['docs', 'dev', 'dev:play', 'dist', 'test', 'test:watch', 'release:check'];
  for (const name of compositeScripts) {
    assert.match(packageJson.scripts[name], /\bnpm\s+(?:run|test)\b/);
    assert.doesNotMatch(packageJson.scripts[name], /\bpnpm\b|run-package-scripts\.js/);
  }
  assert.match(packageJson.scripts.docs, /node build\/bin\/check-docs-assets\.js/);
});

test('Make wrappers invoke only defined npm scripts', () => {
  const invokedScripts = Array.from(makefile.matchAll(/\bnpm run ([\w:-]+)/g), match => match[1]);
  for (const script of invokedScripts) {
    assert.ok(packageJson.scripts[script], `Makefile invokes missing npm script: ${script}`);
  }
});

test('documentation does not generate or link changelog pages', () => {
  const changelogFiles = fs.readdirSync(rootDir).filter(file => /^CHANGELOG\..+\.md$/.test(file));
  assert.deepStrictEqual(changelogFiles, []);
  assert.strictEqual(fs.existsSync(path.join(rootDir, 'examples/pages/template/changelog.tpl')), false);
  assert.doesNotMatch(read('examples/nav.config.json'), /\/changelog|Changelog|更新日志|Lista de cambios/);
  assert.doesNotMatch(read('examples/route.config.js'), /changelog/i);
});

test('maintained development docs use pnpm for dependencies and npm for scripts', () => {
  const developmentFiles = [
    'AGENTS.md',
    'README.md',
    'guides/PROJECT_TAKEOVER_AND_PAGES_MIGRATION.md',
    '.github/CONTRIBUTING.en-US.md',
    '.github/CONTRIBUTING.es.md',
    '.github/CONTRIBUTING.fr-FR.md',
    '.github/CONTRIBUTING.zh-CN.md'
  ];
  const installationFiles = [
    'examples/docs/en-US/installation.md',
    'examples/docs/es/installation.md',
    'examples/docs/fr-FR/installation.md',
    'examples/docs/zh-CN/installation.md'
  ];

  for (const file of developmentFiles) {
    const source = read(file);
    assert.match(source, /\bpnpm install\b/, file);
    assert.match(source, /\bnpm run\b/, file);
    assert.doesNotMatch(source, /\bcorepack\b|\bpackageManager\b\s*:/, file);
  }

  for (const file of installationFiles) {
    assert.doesNotMatch(read(file), /\bpnpm(?:\s|@)/, file);
  }
});

test('Pages uses current actions while permissions stay deploy-only', () => {
  const validateJob = getJob(pagesWorkflow, 'validate');
  const deployJob = getJob(pagesWorkflow, 'deploy');

  assert.deepStrictEqual(getActions(validateJob), ['actions/checkout@v7', 'actions/setup-node@v7']);
  assert.deepStrictEqual(getActions(deployJob), [
    'actions/checkout@v7',
    'actions/setup-node@v7',
    'actions/configure-pages@v6',
    'actions/upload-pages-artifact@v5',
    'actions/deploy-pages@v5'
  ]);
  assert.strictEqual((pagesWorkflow.match(/- run: npm install/g) || []).length, 2);
  assert.strictEqual((pagesWorkflow.match(/node-version: 22/g) || []).length, 2);
  assert.strictEqual((pagesWorkflow.match(/package-manager-cache: false/g) || []).length, 2);
  assert.match(validateJob, /- run: npm run release:check/);
  assert.match(deployJob, /- run: npm run docs/);
  assert.strictEqual((pagesWorkflow.match(/pages: write/g) || []).length, 1);
  assert.strictEqual((pagesWorkflow.match(/id-token: write/g) || []).length, 1);

  assert.doesNotMatch(validateJob, /concurrency:/);
  assert.match(deployJob, /permissions:\n\s+contents: read\n\s+pages: write\n\s+id-token: write/);
  assert.match(deployJob, /concurrency:\n\s+group: pages\n\s+cancel-in-progress: false/);
});

test('npm publication is validation-gated and release-branch only', () => {
  const workflowConfig = publishWorkflow.slice(0, publishWorkflow.indexOf('\njobs:'));
  const validateJob = getJob(publishWorkflow, 'validate');
  const publishJob = getJob(publishWorkflow, 'publish');

  assert.match(workflowConfig, /pull_request:\n\s+branches:\n\s+- main\n\s+- release\/v2/);
  assert.match(workflowConfig, /push:\n\s+branches:\n\s+- release\/v2/);
  assert.match(workflowConfig, /workflow_dispatch:/);
  assert.match(workflowConfig, /permissions:\n\s+contents: read/);
  assert.match(
    workflowConfig,
    /concurrency:\n\s+group: publish-npm-\$\{\{ github\.ref \}\}\n\s+cancel-in-progress: false/
  );
  assert.deepStrictEqual(getActions(validateJob), ['actions/checkout@v7', 'actions/setup-node@v7']);
  assert.match(validateJob, /node-version: 22/);
  assert.match(validateJob, /package-manager-cache: false/);
  assert.match(validateJob, /- run: npm install/);
  assert.match(validateJob, /- run: npm run release:check/);
  assert.match(publishJob, /needs: validate/);
  assert.match(publishJob, /environment: npm/);
  assert.match(publishJob, /github\.ref == 'refs\/heads\/release\/v2'/);
  assert.match(publishJob, /github\.event_name == 'push'/);
  assert.match(publishJob, /github\.event_name == 'workflow_dispatch'/);
});

test('npm publication fails closed before building an existing version', () => {
  const publishJob = getJob(publishWorkflow, 'publish');
  const versionStep = getNamedStep(publishJob, 'Verify package version is unpublished');

  assert.deepStrictEqual(getActions(publishJob), ['actions/checkout@v7', 'actions/setup-node@v7']);
  assert.match(publishJob, /node-version: 22/);
  assert.match(publishJob, /package-manager-cache: false/);
  assert.match(publishJob, /registry-url: "https:\/\/registry\.npmjs\.org\/"/);
  assert.match(publishJob, /- run: npm install/);
  assert.match(versionStep, /require\('\.\/package\.json'\)\.name/);
  assert.match(versionStep, /require\('\.\/package\.json'\)\.version/);
  assert.match(versionStep, /npm view "\$PACKAGE_SPEC" version --registry="https:\/\/registry\.npmjs\.org\/"/);
  assert.match(versionStep, /grep -q "E404"/);
  assert.match(versionStep, /cat "\$VIEW_ERROR" >&2\n\s+exit 1/);

  const versionCheck = publishJob.indexOf('- name: Verify package version is unpublished');
  const build = publishJob.indexOf('- run: npm run dist');
  const publish = publishJob.indexOf('run: npm publish --access public');
  assert.ok(versionCheck !== -1 && versionCheck < build && build < publish);
});

test('npm credentials and side effects are restricted to public npm publication', () => {
  const publishJob = getJob(publishWorkflow, 'publish');
  const publishStep = getNamedStep(publishJob, 'Publish to npm');

  assert.strictEqual((publishWorkflow.match(/NPM_TOKEN/g) || []).length, 1);
  assert.strictEqual((publishWorkflow.match(/NODE_AUTH_TOKEN/g) || []).length, 1);
  assert.match(publishStep, /run: npm publish --access public/);
  assert.match(publishStep, /env:\n\s+NODE_AUTH_TOKEN: \$\{\{ secrets\.NPM_TOKEN \}\}/);
  assert.doesNotMatch(
    publishJob.slice(0, publishJob.indexOf('- name: Publish to npm')),
    /NPM_TOKEN|NODE_AUTH_TOKEN/
  );
  assert.doesNotMatch(publishWorkflow, /contents: write|packages: write|pages: write|id-token: write/);
  assert.doesNotMatch(
    publishJob,
    /npm\.pkg\.github\.com|change-package-name|npm pkg set|git (?:tag|push)|gh release|npm run docs|actions\/(?:configure|upload|deploy)-pages|(?:>|>>)\s*\.npmrc/
  );
});
