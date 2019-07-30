const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const CompressionWebpackPlugin = require('compression-webpack-plugin');
const common = require('./webpack.config.js');


module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.optimize.concatenateModules(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new UglifyJSPlugin({
      test: /[\/.](js)$/i,
      sourceMap: false,
      parallel: true,
      exclude: [/\/images/, /[\/.](json)$/i],
      uglifyOptions: {
        warnings: false,
        parse: {},
        compress: {
          warnings: false, // Suppress uglification warnings
          pure_getters: true,
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
          booleans: true
        },
        mangle: false, // Note `mangle.properties` is `false` by default.
        output: {
          comments: false
        },
        toplevel: false,
        nameCache: null,
        ie8: false,
        keep_fnames: false,
      },
      cache: true
    }),
    new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
    new CompressionWebpackPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
      cache: true
    })
  ]
});