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
      sourceMap: false,
      parallel: true,
      exclude: [/\/images/, /[\/.](json)$/i],
      uglifyOptions: {
        mangle: false,
        compress: {
          warnings: false, // Suppress uglification warnings
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          drop_debugger: true,
          drop_console: true, // strips console statements
          booleans: true,
        }
      },
      output: {
        comments: false,
      }
      cache: true
    }),
    new webpack.optimize.AggressiveMergingPlugin() //Merge chunks
  ]
});