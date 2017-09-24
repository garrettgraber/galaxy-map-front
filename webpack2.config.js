const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log("__dirname: ", __dirname);

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
        },


        // alias: {
        //   Utilities: path.resolve(__dirname, 'src/utilities/'),
        //   Templates: path.resolve(__dirname, 'src/templates/')
        // }
        // root: path.join(__dirname, "src")

        modules: [
            path.join(__dirname),
            "node_modules"
        ]

    },
    module: {
        rules: [
            // {
            //     test: /\.(js|jsx)$/,
            //     include: srcPath,
            //     exclude: /(node_modules|bower_components)/,
            //     loaders: ['react-hot-loader', 'babel?presets[]=react,presets[]=es2015'],
            // },
            {
                test: /\.(js|jsx)$/,
                include: srcPath,
                exclude: /(node_modules|bower_components)/,
                // loaders: ['react-hot-loader', 'babel?presets[]=react,presets[]=es2015'],
                use: [
                    {
                        loader: "react-hot-loader",
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env']
                            // plugins: [require('babel-plugin-transform-object-rest-spread')]
                        }
                    }
                ]
            },
            // {
            //     test: /\.html$/,
            //     loader: 'file-loader?name=[name].[ext]',
            // },
            {
                test: /\.html$/,
                // loader: 'file-loader?name=[name].[ext]',
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]"
                        }
                    }
                ]
            },


            // {
            //     test: /\.css$/,
            //     loader: 'style-loader!css-loader'
            // },
             {
                test: /\.css$/,
                // loader: 'style-loader!css-loader',
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            },

            // {   
            //     test: /\.(png|jpg|gif)$/,
            //     loader: "file-loader?name=images/[name].[ext]"
            // },
            {   
                test: /\.(png|jpg|gif)$/,
                // loader: "file-loader?name=images/[name].[ext]",
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "images/[name].[ext]"
                        }
                    }
                ]
            },


            // {   
            //     test: /\.(svg|ico)$/,
            //     loader: "file-loader?name=[path][name].[ext]"
            // },
            {   
                test: /\.(svg|ico)$/,
                // loader: "file-loader?name=[path][name].[ext]",
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[path][name].[ext]"
                        }
                    }
                ]
            },


            // {
            //     test: /\.(woff|eot|ttf|woff2)(\?.*$|$)/,
            //     loader: 'url-loader?limit=100000&mimetype=application/font-woff'
            // },
            {
                test: /\.(woff|eot|ttf|woff2)(\?.*$|$)/,
                // loader: "url-loader?limit=100000&mimetype=application/font-woff",
                use: [
                    // {
                    //     loader: "url-loader?limit=100000&mimetype=application/font-woff"
                    // },
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
    plugins: [ 
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};