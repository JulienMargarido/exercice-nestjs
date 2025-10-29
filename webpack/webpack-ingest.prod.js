/* eslint-disable @typescript-eslint/no-require-imports */
const webpack = require('webpack');
const webpackProd = require('./webpack.prod');

module.exports = (options) => webpackProd('ingest', options, webpack);
