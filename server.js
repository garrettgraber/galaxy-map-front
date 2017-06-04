const path = require('path');
const express = require('express');
const ip = require('ip');
const mongoose = require('mongoose');
const cors = require('cors');
const jsonfile = require('jsonfile');
const request = require('request');


const DatabaseLinks = require('docker-links').parseLinks(process.env);

console.log("DatabaseLinks: ", DatabaseLinks);



console.log("NODE_ENV: ", process.env.NODE_ENV);


const isDeveloping = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';
// const port = isDeveloping ? 8108 : process.env.PORT;



if(DatabaseLinks.hasOwnProperty('api') && isDeveloping) {

  var API = 'http://' + DatabaseLinks.api.hostname + ':' + DatabaseLinks.api.port;
  // var TILES = 'http://' + DatabaseLinks.tiles.hostname + ':' + DatabaseLinks.tiles.port + '/tiles-leaflet-new/{z}/{x}/{y}.png';
  var hostname =  ip.address();

} else if(isProduction) {

  // var API = 'ec2-52-205-105-107.compute-1.amazonaws.com';
  var API = 'http://172.31.70.31:80'
  var hostname = '0.0.0.0';


} else {

  var API = 'http://localhost:8107';
  var hostname = '0.0.0.0';

}

console.log("API: ", API);

const port = 8108;
const app = express();


console.log("DatabaseLinks: ", DatabaseLinks);
console.log("ip: ", ip.address());



// if (true) {

  let webpack = require('webpack');
  let webpackMiddleware = require('webpack-dev-middleware');
  let webpackHotMiddleware = require('webpack-hot-middleware');
  let config = require('./webpack.config.js');

  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true,
    quiet: false,
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    stats: {
      colors: true,
    }
  });


  const bundlePath = path.join(__dirname, './public/build/index.html');

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get(/^\/(?!api).*/, function response(req, res) {
    console.log("\ncall made to webpack");

    console.log('==> 🌎 Listening on port. Open up http://' + ip.address() + ':' + port);

    res.write(middleware.fileSystem.readFileSync(bundlePath));
    // res.end();
  });
  app.get('/api/*', function(req, res) {

    console.log("\ncall made to api: ", API + req.url);

    const apiFragUrl = req.url;
    const apiFullUrl = API + apiFragUrl;

    console.log("API: ", API);
    console.log("request url: ", req.url);
    console.log("request path: ", req.path);
    console.log("apiFragUrl: ", apiFragUrl);
    console.log("apiFullUrl: ", apiFullUrl);


    // req.session.valid = true;

    // res.redirect(apiFullUrl);

    request(apiFullUrl, function(error, response, body) {

      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode); 
      console.log('body:', body);

    });

  });

// } else {
//   const staticPath = path.join(__dirname, 'public/build')
//   app.use(express.static(staticPath));
// }


var utcTimeZoneOffset = -7;

app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();

});


// app.use(cors());

// const corsOptions = {
//   origin: API
// }

// app.use(cors(corsOptions))




app.listen(port, hostname, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://' + hostname + ':%s/ in your browser.', port, port);
});



function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}