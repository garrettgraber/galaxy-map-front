const path = require('path');
const express = require('express');
const ip = require('ip');
const mongoose = require('mongoose');
const cors = require('cors');
const jsonfile = require('jsonfile');


const DatabaseLinks = require('docker-links').parseLinks(process.env);

console.log("DatabaseLinks: ", DatabaseLinks);

if(DatabaseLinks.hasOwnProperty('api')) {

  var API = 'http://' + DatabaseLinks.api.hostname + ':' + DatabaseLinks.api.port;

} else {

  var API = 'http://localhost:8107';

}

console.log("API: ", API);


const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 8108 : process.env.PORT;
const app = express();


console.log("DatabaseLinks: ", DatabaseLinks);
console.log("ip: ", ip.address());



if (isDeveloping) {

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

    console.log("\ncall made to api: ", API + req.originalUrl);
    // req.session.valid = true;

    res.redirect(API + req.originalUrl);
  });

} else {
  const staticPath = path.join(__dirname, 'public/build')
  app.use(express.static(staticPath));
}


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




app.listen(port, ip.address(), function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://' + ip.address() + ':%s/ in your browser.', port, port);
});



function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}