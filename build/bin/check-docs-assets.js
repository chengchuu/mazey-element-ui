'use strict';

const fs = require('fs');
const path = require('path');

const outputDir = path.resolve(__dirname, '../../examples/element-ui');
const routeChunks = fs.readdirSync(outputDir).filter(file => /^(?:en-US|es|fr-FR|zh-CN)\..+\.js$/.test(file));
const namespaceAssetRequire = /\.t\(\w+\(\d+\)\)/;

for (const file of routeChunks) {
  const source = fs.readFileSync(path.join(outputDir, file), 'utf8');
  if (namespaceAssetRequire.test(source)) {
    throw new Error(`Documentation chunk ${ file } namespace-wraps an asset URL.`);
  }
}
