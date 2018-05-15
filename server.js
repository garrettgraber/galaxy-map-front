const fs = require('fs');
const path = require('path');
const express = require('express');
const ip = require('ip');
const mongoose = require('mongoose');
const cors = require('cors');
const jsonfile = require('jsonfile');
const request = require('request');
const bodyParser = require('body-parser');
const compression = require('compression');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const environmentSetup = require('./environment-setup.js');
const EnvironmentEndpoints = environmentSetup(process.env.NODE_ENV);
const API = EnvironmentEndpoints.apiServerUrl;
const hostname = EnvironmentEndpoints.hostname;
console.log("Environment Endpoints: ", EnvironmentEndpoints);

const bundlePath = path.join(__dirname, '/public/build/index.html');
const bundleFolder = path.join(__dirname, '/public/build');
const port = 8108;
const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const isDeveloping = (process.env.NODE_ENV !== 'production')? true : false;

if(isDeveloping) {
  const configDevelopment = require('./webpack.dev.js');
  const compiler = webpack(configDevelopment);
  const middleware = webpackMiddleware(compiler, {
    publicPath: configDevelopment.output.publicPath,
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
  })
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('/', function(req, res) {
    console.log("\ncall made to webpack --> Development <--");
    console.log('==> 🌎 Listening on port. Open up http://' + hostname + ':' + port);
    res.write(middleware.fileSystem.readFileSync(bundlePath));
    res.end();
  });
} else {
  app.get('/', function(req, res) {
    app.use(express.static(bundleFolder));
    console.log("\ncall made to webpack --> Production <-- ");
    console.log('==> 🌎 Listening on port. Open up http://' + hostname + ':' + port);
    res.sendFile(bundlePath);
  });
}

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