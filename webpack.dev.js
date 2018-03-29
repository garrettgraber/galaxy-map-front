
const merge = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public/build'
  }
});