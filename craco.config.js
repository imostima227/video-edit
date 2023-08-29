/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const CracoLessPlugin = require('craco-less');
const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
const { loaderByName } = require('@craco/craco');

const lessModuleRegex = /\.module\.less$/;
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
        modifyLessRule(lessRule) {
          lessRule.exclude = lessModuleRegex;
          return lessRule;
        },
        modifyLessModuleRule(lessModuleRule) {
          lessModuleRule.test = lessModuleRegex;
          const cssLoader = lessModuleRule.use.find(loaderByName('css-loader'));
          cssLoader.options.modules = {
            localIdentName: '[local]_[hash:base64:5]',
          };

          return lessModuleRule;
        },
      },
    },
  ],
  webpack: {
    alias: {
      '@': resolve('src'),
      '@api': resolve('src/api'),
      '@data': resolve('src/data_manage'),
      '@type': resolve('src/types'),
      '@components': resolve('src/components'),
    }
  },
};