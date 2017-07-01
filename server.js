'use strict';

//  OpenShift sample Node application
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const ejs = require('ejs');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('config');

const db = require('./server/core/db');
const routes = require('./server/routes');

const app = express();

db.connectDB()
  .then(() => {
    console.info('Connection to DB succeeded');

    app.engine('html', require('ejs').renderFile);
    app
      .options('*', cors())
      .use(cors())
      .use(morgan('combined'))
      .use(favicon(path.join(config.get('public'), 'favicon.ico')))
      .use('/', express.static(config.get('public')))
      // use body parser so we can get info from POST and/or URL parameters
      .use(bodyParser.urlencoded({extended: false}))
      .use(bodyParser.json());

    const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
      ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

    // error handling
    app.use(function (err, req, res, next) {
      console.error(err.stack);
      res.status(500).send('Something bad happened!');
    });

    routes.init(app);

    app.listen(port, ip);
    console.log('Server running on http://%s:%s', ip, port);
  })
  .catch((err) => {
    console.log(err);
    console.error('Server not running');

  });


module.exports = app;
