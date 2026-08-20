'use strict';

const webpack = require('webpack');
const Promise = global.Promise;

const defaultTargets = ['conf', 'common', 'component'];
const targets = process.argv.slice(2);
const configs = (targets.length ? targets : defaultTargets)
  .map(target => require(`../webpack.${target}`));

function compile(config) {
  return new Promise((resolve, reject) => {
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
          reject(error || closeError || new Error('Package compilation failed.'));
          return;
        }
        resolve();
      };
      const closeTimeout = setTimeout(finish, 5000);
      compiler.close(closeError => {
        clearTimeout(closeTimeout);
        finish(closeError);
      });
    });
  });
}

configs.reduce((pending, config) => pending.then(() => compile(config)), Promise.resolve())
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
