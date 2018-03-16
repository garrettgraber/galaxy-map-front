
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  plugins: [
    new UglifyJSPlugin({
      test: /[\/.](js)$/i,
      sourceMap: false,
      parallel: true,
      exclude: [/\/images/, /[\/.](json)$/i],
      uglifyOptions: {
        mangle: false
      }
    })
  ]
});