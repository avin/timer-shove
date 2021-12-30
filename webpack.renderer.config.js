const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { NODE_ENV } = process.env;
const inDevelopment = NODE_ENV === 'development';

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const cssRule = ({ exclude, modules, sourceMap, test }) => ({
  test,
  exclude,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        sourceMap: sourceMap || inDevelopment,
        modules: modules && {
          localIdentName: '[name]_[local]_[hash:base64:5]',
        },
      },
    },
    'sass-loader',
  ],
});

rules.push(cssRule({ test: cssRegex, exclude: cssModuleRegex }));
rules.push(cssRule({ test: cssModuleRegex, modules: true }));
rules.push(cssRule({ test: sassRegex, exclude: sassModuleRegex }));
rules.push(cssRule({ test: sassModuleRegex, modules: true }));

module.exports = {
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'icons'),
          to: path.resolve(__dirname, '.webpack/main', 'icons'),
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src', 'app'),
    },
  },
};
