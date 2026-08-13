'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const rootDir = path.resolve(__dirname, '..');
const packageJson = require('../package.json');
const workflow = fs.readFileSync(path.join(rootDir, '.github/workflows/validate-and-pages.yml'), 'utf8');

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

test('repository does not provision or pin the local package manager', () => {
  assert.strictEqual(packageJson.packageManager, undefined);
  assert.strictEqual(packageJson.scripts.bootstrap, undefined);
  assert.doesNotMatch(workflow, /pnpm\/action-setup|corepack|cache:\s*(?:npm|pnpm)/);
});

test('clean removes every generated package and test output boundary', () => {
  for (const generatedPath of ['lib', 'dist', 'packages/*/lib', 'test/**/coverage']) {
    assert.match(packageJson.scripts.clean, new RegExp(`(?:^|\\s)${generatedPath.replace(/[*/]/g, '\\$&')}(?:$|\\s)`));
  }
});

test('composite scripts use npm for nested package scripts', () => {
  const compositeScripts = ['deploy:build', 'dev', 'dev:play', 'dist', 'test', 'test:watch', 'release:check'];
  for (const name of compositeScripts) {
    assert.match(packageJson.scripts[name], /\bnpm\s+(?:run|test)\b/);
    assert.doesNotMatch(packageJson.scripts[name], /\bpnpm\b|run-package-scripts\.js/);
  }
});

test('maintained development and installation docs use npm commands', () => {
  const documentationFiles = [
    'AGENTS.md',
    'README.md',
    'guides/PROJECT_TAKEOVER_AND_PAGES_MIGRATION.md',
    '.github/CONTRIBUTING.en-US.md',
    '.github/CONTRIBUTING.es.md',
    '.github/CONTRIBUTING.fr-FR.md',
    '.github/CONTRIBUTING.zh-CN.md',
    'examples/docs/en-US/installation.md',
    'examples/docs/es/installation.md',
    'examples/docs/fr-FR/installation.md',
    'examples/docs/zh-CN/installation.md'
  ];

  for (const file of documentationFiles) {
    const source = read(file);
    assert.doesNotMatch(source, /\bpnpm(?:\s|@)|\bcorepack\b/, file);
  }
});

test('GitHub Actions uses npm while Pages permissions stay deploy-only', () => {
  assert.strictEqual((workflow.match(/- run: npm install/g) || []).length, 2);
  assert.match(workflow, /- run: npm run release:check/);
  assert.match(workflow, /- run: npm run deploy:build/);
  assert.strictEqual((workflow.match(/pages: write/g) || []).length, 1);
  assert.strictEqual((workflow.match(/id-token: write/g) || []).length, 1);

  const validationJobs = workflow.slice(0, workflow.indexOf('  deploy:'));
  const deployJob = workflow.slice(workflow.indexOf('  deploy:'));
  assert.doesNotMatch(validationJobs, /concurrency:/);
  assert.match(deployJob, /permissions:\n\s+contents: read\n\s+pages: write\n\s+id-token: write/);
  assert.match(deployJob, /concurrency:\n\s+group: pages\n\s+cancel-in-progress: false/);
});
