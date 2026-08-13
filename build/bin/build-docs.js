'use strict';

const webpack = require('webpack');
const config = require('../webpack.demo');

const compiler = webpack(config);

compiler.run((error, stats) => {
  const output = stats && stats.toString(config.stats);
  if (output) {
    console.log(output);
  }

  let closed = false;
  const finish = closeError => {
    if (closed) return;
    closed = true;
    if (error || closeError || (stats && stats.hasErrors())) {
      console.error(error || closeError || 'Documentation compilation failed.');
      process.exit(1);
    }
    process.exit(0);
  };
  const closeTimeout = setTimeout(finish, 5000);
  compiler.close(closeError => {
    clearTimeout(closeTimeout);
    finish(closeError);
  });
});
