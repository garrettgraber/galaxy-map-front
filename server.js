const path = require('path');
const express = require('express');
const ip = require('ip');
const mongoose = require('mongoose');
const cors = require('cors');
const jsonfile = require('jsonfile');
const request = require('request');
const bodyParser = require('body-parser');


const DatabaseLinks = require('docker-links').parseLinks(process.env);

console.log("DatabaseLinks: ", DatabaseLinks);



// console.log("NODE_ENV: ", process.env.NODE_ENV);


const isDeveloping = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';
// const port = isDeveloping ? 8108 : process.env.PORT;



if(DatabaseLinks.hasOwnProperty('api') && isDeveloping) {

  var API = 'http://' + DatabaseLinks.api.hostname + ':' + DatabaseLinks.api.port;
  // var TILES = 'http://' + DatabaseLinks.tiles.hostname + ':' + DatabaseLinks.tiles.port + '/tiles-leaflet-new/{z}/{x}/{y}.png';
  var hostname =  ip.address();

} else if(isProduction) {

  // var API = 'ec2-52-205-105-107.compute-1.amazonaws.com';

  var API = 'http://172.31.76.44:80';
  var hostname = '0.0.0.0';


} else {

  var API = 'http://localhost:8107';
  var hostname = '0.0.0.0';

}

// console.log("API: ", API);

const port = 8108;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

  console.log('==> 🌎 Listening on port. Open up http://' + hostname + ':' + port);

  res.write(middleware.fileSystem.readFileSync(bundlePath));
  // res.end();
});
app.get('/api/*', function(req, res) {
  console.log("\ncall made to api: ", API + req.url);
  const apiFragUrl = req.url;
  const apiFullUrl = API + apiFragUrl;
  request(apiFullUrl, function(error, response, body) {
    // console.log('error:', error);
    // console.log('statusCode:', response && response.statusCode); 
    // // console.log('body:', body);
    if(error) {
      // console.log("error: ", error);
    } else if(response.statusCode === 200) {
      // console.log('body:', body.length);
      res.json(body);
    } else {
      // console.log("API error");
    }
  });
});
app.post(/^\/(?!api).*/, function response(req, res) {
  console.log("\npost made to webpack");
  console.log('==> 🌎 Listening on port. Open up http://' + hostname + ':' + port);
  // res.end();
});
app.post('/api/*', function(req, res) {
  console.log("\npost made to api: ", API + req.url);
  console.log("post data: ", req.body);
  const apiFragUrl = req.url;
  const apiFullUrl = API + apiFragUrl;
  // res.json(req.body);
  const JumpData = req.body;
  const options = {
    method: 'post',
    body: JumpData,
    json: true,
    url: API + apiFragUrl
  };

  request(options, function (error, response, body) {

    if(error) {
      console.log("error getting data from api: ", error);
      res.sendStatus(500);
    } else {
      console.log("Found hyperspace jump, loading to front end!!");
      res.json(body);
    }

  });

  // var Options = {
  //   uri: apiFullUrl,
  //   method: 'POST',
  //   json: {
  //     "longUrl": "http://www.google.com/"
  //   }
  // };

  // request.post(apiFullUrl, {
  //   formData: req.body,
  //   json: true
  // }, function(error, response, body) {
  //   console.log('error:', error);
  //   console.log('statusCode:', response && response.statusCode); 
  //   console.log('body:', body);
  //   if(error) {
  //     console.log("error: ", error);
  //   } else if(response.statusCode === 200) {
  //     console.log('body:', body);
  //     res.json(req.body);
  //     // res.json(body);
  //   } else {
  //     console.log("API error");
  //   }
  // });


});
// } else {
//   const staticPath = path.join(__dirname, 'public/build')
//   app.use(express.static(staticPath));
// }



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




const server = app.listen(port, hostname, function onStart(err) {
  console.log("hostname: ", hostname);
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://' + hostname + ':%s/ in your browser.', port, port);
});

server.keepAliveTimeout = 60000 * 2;



function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}