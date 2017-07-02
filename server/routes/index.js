'use strict';

const Actualities = require('../services/actualities');
const Competitions = require('../services/competitions');
const Users = require('../services/users');

module.exports.init = (app) => {
  app.get('/api/actualities', Actualities.get);
  app.post('/api/actualities', Users.isAuthenticated, Actualities.post);
  app.put('/api/actualities/:id', Users.isAuthenticated, Actualities.put);
  app.delete('/api/actualities/:id', Users.isAuthenticated, Actualities.delete);
  app.get('/api/competitions', Competitions.get);
  app.post('/api/competitions', Users.isAuthenticated, Competitions.post);
  app.put('/api/competitions/:id', Users.isAuthenticated, Competitions.put);
  app.delete('/api/competitions/:id', Users.isAuthenticated, Competitions.delete);
  app.get('/api/auth', Users.isAuthenticated, (req, res) => res.status(200).send({status: 'authenticated'}));
  app.post('/api/auth', Users.authenticate);
  app.post('/set-user', Users.isAuthenticated, Users.post);
};
