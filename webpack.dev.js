const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'development',
	entry: [
		// 'react-hot-loader/patch',
		'webpack-hot-middleware/client?reload=true'
	],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public/build'
  },
  plugins: [
  	new webpack.HotModuleReplacementPlugin(),
  ]
});