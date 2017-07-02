'use strict';

const Actualities = require('../services/actualities');
const Users = require('../services/users');

module.exports.init = (app) => {
  app.get('/api/actualities', Actualities.get);
  app.post('/api/actualities', Users.isAuthenticated, Actualities.post);
  app.put('/api/actualities/:id', Users.isAuthenticated, Actualities.put);
  app.delete('/api/actualities/:id', Users.isAuthenticated, Actualities.delete);
  app.get('/api/auth', Users.isAuthenticated, (req, res) => res.status(200).send({status: 'authenticated'}));
  app.post('/api/auth', Users.authenticate);
  app.post('/api/add-user', Users.addUser);
  app.post('/set-user', Users.isAuthenticated, Users.post);
};
