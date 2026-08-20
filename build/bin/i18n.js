'use strict';

var fs = require('fs');
var path = require('path');
var langConfig = require('../../examples/i18n/page.json');

langConfig.forEach(lang => {
  const outputDir = path.resolve(__dirname, `../../examples/pages/${ lang.lang }`);
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  Object.keys(lang.pages).forEach(page => {
    var templatePath = path.resolve(__dirname, `../../examples/pages/template/${ page }.tpl`);
    var outputPath = path.resolve(outputDir, `${ page }.vue`);
    var content = fs.readFileSync(templatePath, 'utf8');
    var pairs = lang.pages[page];

    Object.keys(pairs).forEach(key => {
      content = content.replace(new RegExp(`<%=\\s*${ key }\\s*>`, 'g'), pairs[key]);
    });

    fs.writeFileSync(outputPath, content);
  });
});
