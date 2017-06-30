'use strict';

const Actualities = require('../services/actualities');
const Users = require('../services/users');

module.exports.init = (app) => {
  app.get('/api/actualities', Actualities.get);
  app.post('/api/actualities', Users.isAuthenticated, Actualities.post);
  app.delete('/api/actualities/:id', Users.isAuthenticated, Actualities.delete);
  app.post('/auth', Users.authenticate);
  app.post('/set-user', Users.isAuthenticated, Users.post);
};
