'use strict';

const fs = require('fs');
const path = require('path');

const outputDir = path.resolve(__dirname, '../../examples/element-ui');
const siteUrl = 'https://chengchuu.github.io/mazey-element-ui/';

if (!fs.existsSync(path.join(outputDir, 'index.html'))) {
  throw new Error('Pages build is missing index.html');
}

fs.writeFileSync(path.join(outputDir, '.nojekyll'), '');
fs.writeFileSync(
  path.join(outputDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`
);
fs.writeFileSync(
  path.join(outputDir, 'sitemap.xml'),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${siteUrl}</loc></url>`,
    '</urlset>',
    ''
  ].join('\n')
);
