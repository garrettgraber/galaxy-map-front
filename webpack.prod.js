const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new UglifyJSPlugin({
      test: /[\/.](js)$/i,
      sourceMap: true,
      parallel: true,
      exclude: [/\/images/, /[\/.](json)$/i],
      uglifyOptions: {
        mangle: false
      }
    })
  ]
});