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
      .use((req, res, next) => {
        if(!config.get('secure') || req.headers['x-forwarded-proto'] === 'https'){
          return next();
        }
        console.log('Redirect to secure route');
        res.redirect(config.get('publicHost') + req.url);
      })
      .use('/', express.static(config.get('public')))
      // use body parser so we can get info from POST and/or URL parameters
      .use(bodyParser.urlencoded({extended: false}))
      .use(bodyParser.json());

    const port = process.env.PORT || 8080,
      ip = process.env.IP || '0.0.0.0';

    routes.init(app);
    app.use('*', (req, res) => {
      return res.redirect(config.get('publicHost'));
    });

    app.listen(port, ip);
    console.log(`Server running on ${config.get('host')}: http://${ip}:${port}`);
  })
  .catch((err) => {
    console.log(err);
    console.error('Server not running');

  });


module.exports = app;
