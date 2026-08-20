const webpackConfig = require('../../build/webpack.test');

module.exports = function(config) {
  const configuration = {
    plugins: [
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-mocha'),
      require('karma-sinon-chai'),
      require('karma-sourcemap-loader'),
      require('karma-spec-reporter'),
      require('karma-webpack')
    ],
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['spec', 'coverage'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    client: {
      mocha: {
        timeout: 4000
      }
    }
  };

  config.set(configuration);
};
