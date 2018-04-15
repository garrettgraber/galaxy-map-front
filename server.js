const path = require('path');
const express = require('express');
const ip = require('ip');
const mongoose = require('mongoose');
const cors = require('cors');
const jsonfile = require('jsonfile');
const request = require('request');
const bodyParser = require('body-parser');

const environmentSetup = require('./environment-setup.js');
const EnvironmentEndpoints = environmentSetup(process.env.NODE_ENV);
const API = EnvironmentEndpoints.apiServerUrl;
const hostname = EnvironmentEndpoints.hostname;
console.log("Environment Endpoints: ", EnvironmentEndpoints);

const port = 8108;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// console.log("ip: ", ip.address());

// let webpack = require('webpack');
// let webpackMiddleware = require('webpack-dev-middleware');
// let webpackHotMiddleware = require('webpack-hot-middleware');
// let config = require('./webpack.config.js');





let webpack = require('webpack');
let webpackMiddleware = require('webpack-dev-middleware');
let webpackHotMiddleware = require('webpack-hot-middleware');
let config = require('./webpack.config.js');
let configProduction = require('./webpack.prod.js');
let configDevelopment = require('./webpack.dev.js');

const NODE_ENV = process.env.NODE_ENV;
switch (NODE_ENV) {
  case 'development':
    config = configDevelopment;
    break;
  case 'production':
    config = configProduction;
    break;
  default:
}


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
const bundlePathProduction = path.join(__dirname, './public/build/index-production.html');


app.use(middleware);

app.use(webpackHotMiddleware(compiler));

// app.get('*.js', function (req, res, next) {

//   console.log("Calling js file");
//   req.url = req.url + '.gz';
//   res.set('Content-Encoding', 'gzip');
//   next();
// });

app.get(/^\/(?!api).*/, function(req, res) {
  console.log("\ncall made to webpack");
  console.log('==> 🌎 Listening on port. Open up http://' + hostname + ':' + port);

  if(EnvironmentEndpoints.environmentName === 'development') {
    res.write(middleware.fileSystem.readFileSync(bundlePath));
  } else if(EnvironmentEndpoints.environmentName === 'production') {
    res.set('Content-Encoding', 'gzip');
    res.write(middleware.fileSystem.readFileSync(bundlePathProduction));
  } else {
    console.log("not production or development");
  }

});

app.get('/api/*', function(req, res) {
  console.log("\ncall made to api: ", API + req.url);
  const apiFragUrl = req.url;
  const apiFullUrl = API + apiFragUrl;
  request(apiFullUrl, function(error, response, body) {
    if(error) {
      console.log("error: ", error);
    } else if(response.statusCode === 200) {
      res.send(body);
    } else {
      // console.log("API error");
    }
  });
});

app.post(/^\/(?!api).*/, function response(req, res) {
  console.log("\npost made to webpack");
  console.log('==> 🌎 Listening on port. Open up http://' + hostname + ':' + port);
});

app.post('/api/*', function(req, res) {
  console.log("\npost made to api: ", API + req.url);
  console.log("post data: ", req.body);
  const apiFragUrl = req.url;
  const apiFullUrl = API + apiFragUrl;
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
      res.send(body);
    }
  });
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
