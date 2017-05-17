


// var path = require('path');
// var webpack = require('webpack');


// module.exports = {
//   context: __dirname + "/",
//   entry: {
//     javascript: './scripts/index.js',
//     html: './index.html'
//   },
//   output: {
//     path: __dirname + "/dist",
//     filename: "bundle.js"
//   },
//   module: {
//     loaders: [
//       {
//         test: /\.jsx?$/,
//         loader: 'babel-loader',
//         exclude: /node_modules/
//       }
//     ]
//   }
// }



var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');


console.log("__dirname: ", __dirname);




var javascriptEntryPath = path.resolve(__dirname, 'src', 'index.js');
var htmlEntryPath = path.resolve(__dirname, 'src', 'index.html');
var buildPath = path.resolve(__dirname, 'public', 'build');
var srcPath = path.resolve(__dirname, 'src');


console.log("javascriptEntryPath: ", javascriptEntryPath);
console.log("htmlEntryPath: ", htmlEntryPath);
console.log("buildPath:", buildPath);
console.log("srcPath: ", srcPath);


module.exports = {
    entry: [
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
        extensions: ['', '.html', '.js', '.json', '.scss', '.css'],
        alias: {
            leaflet_css: path.join(__dirname, "/node_modules/leaflet/dist/leaflet.css"),
            leaflet_marker: path.join(__dirname, "/node_modules/leaflet/dist/images/marker-icon.png"),
            leaflet_marker_2x: path.join(__dirname, "/node_modules/leaflet/dist/images/marker-icon-2x.png"),
            leaflet_marker_shadow: path.join(__dirname,"/node_modules/leaflet/dist/images/marker-shadow.png")
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: srcPath,
                exclude: /(node_modules|bower_components)/,
                loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015'],
            },
            {
                test: /\.html$/,
                loader: 'file?name=[name].[ext]',
            },
            // {
            //   //IMAGE LOADER
            //   test: /\.(jpe?g|png|gif|svg)$/i,
            //   loader:'file'
            // },
            // {
            //   test: /\.css$/,
            //   loader: 'style-loader'
            // },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {test: /\.(png|jpg)$/, loader: "file-loader?name=images/[name].[ext]"},
            // {
            //     test: /\.css$/,
            //     loader: 'css-loader',
            //     query: {
            //         // modules: true,
            //         localIdentName: '[name]__[local]___[hash:base64:5]'
            //     }
            // },
            // {
            //     test: /\.(jpg|png)$/,
            //     // loader: 'file-loader',
            //     loader: 'file-loader?name=[path][name].[ext]',
            //     options: {
            //         name: '../map-tiles/[path][name].[ext]',
            //     }
            // },
            { 
                test: /\.json$/,
                loader: "json-loader"
            }
        ], 
    },
    plugins: [ 
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
}



// module.exports = {
//     target: "web",
//     cache: true,
//     entry: {
//         app: path.join(srcPath, "index.js")
//     },
//     output: {
//         path: path.join(__dirname, "dist"),
//         publicPath: "/dist/",
//         filename: 'bundle.js',
//         pathInfo: true
//     },
//     resolve: {
//         extensions: ['', '.html', '.js', '.json', '.scss', '.css'],
//         alias: {
//             leaflet_css: __dirname + "/node_modules/leaflet/dist/leaflet.css",
//             leaflet_marker: __dirname + "/node_modules/leaflet/dist/images/marker-icon.png",
//             leaflet_marker_2x: __dirname + "/node_modules/leaflet/dist/images/marker-icon-2x.png",
//             leaflet_marker_shadow: __dirname + "/node_modules/leaflet/dist/images/marker-shadow.png"
//         }
//     },
//     module: {
//         loaders: [
//           {test: /\.js?$/, exclude: /node_modules/, loader: "babel-loader"},
//           {test: /\.scss?$/, exclude: /node_modules/, loader: "style-loader!css-loader!sass-loader!"},
//           {test: /\.css?$/, loader: "style-loader!css-loader!"},
//           {test: /\.(png|jpg)$/, loader: "file-loader?name=images/[name].[ext]"}
//         ]
//     },
//     plugins: [
//         new webpack.optimize.CommonsChunkPlugin("common", "common.js"),
//         new HtmlWebpackPlugin({
//           inject: true,
//           template: "src/index.html"
//         }),
//         new webpack.NoErrorsPlugin()
//     ]

// }
