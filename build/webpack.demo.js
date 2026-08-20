const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const config = require('./config');

const isProd = process.env.NODE_ENV === 'production';
const isPlay = !!process.env.PLAY_ENV;

const webpackConfig = {
  mode: process.env.NODE_ENV,
  entry: isProd ? {
    docs: './examples/entry.js'
  } : (isPlay ? './examples/play.js' : './examples/entry.js'),
  output: {
    path: path.resolve(process.cwd(), './examples/element-ui/'),
    publicPath: process.env.CI_ENV || '/mazey-element-ui/',
    filename: '[name].[contenthash:7].js',
    chunkFilename: isProd ? '[name].[contenthash:7].js' : '[name].js',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: config.alias,
    modules: ['node_modules']
  },
  devServer: {
    host: '0.0.0.0',
    port: 8085,
    hot: true,
    devMiddleware: {
      publicPath: '/mazey-element-ui/'
    }
  },
  performance: {
    hints: false
  },
  stats: {
    children: false
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: config.jsexclude,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          },
          {
            loader: path.resolve(__dirname, './md-loader/index.js')
          }
        ]
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: { maxSize: 10000 }
        },
        generator: {
          filename: path.posix.join('static', '[name].[contenthash:7][ext]')
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './examples/index.tpl',
      filename: './index.html'
    }),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'examples/favicon.ico', to: 'favicon.ico' }
      ]
    })
  ],
  optimization: {
    minimizer: []
  },
  devtool: '#eval-source-map'
};

if (isProd) {
  webpackConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:7].css'
    })
  );
  webpackConfig.optimization.minimizer.push(
    '...',
    new CssMinimizerPlugin()
  );
  // https://webpack.js.org/configuration/optimization/#optimizationsplitchunks
  webpackConfig.optimization.splitChunks = {
    cacheGroups: {
      vendor: {
        test: /\/src\//,
        name: 'mazey-element-ui',
        chunks: 'all'
      }
    }
  };
  webpackConfig.devtool = false;
}

module.exports = webpackConfig;
