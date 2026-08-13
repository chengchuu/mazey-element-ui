'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mazey-element-ui-npm-cache-'));

try {
  const result = spawnSync('npm', ['pack', '--dry-run'], {
    cwd: path.resolve(__dirname, '../..'),
    stdio: 'inherit',
    env: Object.assign({}, process.env, { npm_config_cache: cacheDir })
  });
  if (result.status !== 0) process.exitCode = result.status || 1;
} finally {
  fs.rmSync(cacheDir, { recursive: true, force: true });
}
