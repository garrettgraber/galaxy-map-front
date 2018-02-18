const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const jsonfile = require('jsonfile');

const environmentSetup = require('./environment-setup.js');

const javascriptEntryPath = path.resolve(__dirname, 'src', 'index.js');
const htmlEntryPath = path.resolve(__dirname, 'src', 'index.html');
const buildPath = path.resolve(__dirname, 'public', 'build');
const srcPath = path.resolve(__dirname, 'src');

console.log("javascriptEntryPath: ", javascriptEntryPath);
console.log("htmlEntryPath: ", htmlEntryPath);
console.log("buildPath:", buildPath);
console.log("srcPath: ", srcPath);

module.exports = {
  devtool: 'source-map',
  entry: [
    'react-hot-loader/patch',
    'whatwg-fetch',
    'webpack-hot-middleware/client?reload=true', 
    javascriptEntryPath,
    htmlEntryPath
  ],
  output: {
    publicPath: "/",
    path: buildPath,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['*', '.html', '.js', '.json', '.scss', '.css'],
    alias: {
      leaflet_css: path.join(__dirname, "/node_modules/leaflet/dist/leaflet.css"),
      leaflet_marker: path.join(__dirname, "/node_modules/leaflet/dist/images/marker-icon.png"),
      leaflet_marker_2x: path.join(__dirname, "/node_modules/leaflet/dist/images/marker-icon-2x.png"),
      leaflet_marker_shadow: path.join(__dirname,"/node_modules/leaflet/dist/images/marker-shadow.png")
    },
    modules: [
      path.join(__dirname),
      "node_modules"
    ]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: srcPath,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                'es2017',
                'react',
                'stage-3'
              ].map(dep => require.resolve(`babel-preset-${dep}`))
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          }
        ]
      },
       {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          "less-loader"
        ]
      },
      {   
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "images/[name].[ext]"
            }
          }
        ]
      },
      {   
        test: /\.(svg|ico)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(woff|eot|ttf|woff2)(\?.*$|$)/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: "limit=100000&mimetype=application/font-woff"
            }
          }
        ]
      },
    ],
  },
  externals: {
    'Config': JSON.stringify(environmentSetup(process.env.NODE_ENV))
  },
  plugins: [ 
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
