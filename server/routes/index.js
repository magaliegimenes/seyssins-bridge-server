'use strict';
const multer  = require('multer');
const config = require('config');

const Actualities = require('../services/actualities');
const Competitions = require('../services/competitions');
const Clublife = require('../services/clublife');
const Users = require('../services/users');

const upload = multer({ dest: __dirname + 'uploads/', limits: {fileSize: config.get('uploadLimit')} });

module.exports.init = (app) => {
  app.get('/api/actualities', Actualities.get);
  app.post('/api/actualities', Users.isAuthenticated, Actualities.post);
  app.put('/api/actualities/:id', Users.isAuthenticated, Actualities.put);
  app.delete('/api/actualities/:id', Users.isAuthenticated, Actualities.delete);
  app.post('/api/actualities/:id/picture', Users.isAuthenticated, upload.single('picture'), Actualities.uploadPicture);
  app.get('/api/competitions', Competitions.get);
  app.post('/api/competitions', Users.isAuthenticated, Competitions.post);
  app.put('/api/competitions/:id', Users.isAuthenticated, Competitions.put);
  app.delete('/api/competitions/:id', Users.isAuthenticated, Competitions.delete);
  app.post('/api/competitions/:id/picture', Users.isAuthenticated,  upload.single('picture'), Competitions.uploadPicture);
  app.get('/api/clublife', Clublife.get);
  app.post('/api/clublife', Users.isAuthenticated, Clublife.post);
  app.put('/api/clublife/:id', Users.isAuthenticated, Clublife.put);
  app.delete('/api/clublife/:id', Users.isAuthenticated, Clublife.delete);
  app.post('/api/clublife/:id/file', Users.isAuthenticated,  upload.single('file'), Clublife.uploadFile);
  app.get('/api/clublife/:id/file', Clublife.getFile);
  app.get('/api/auth', Users.isAuthenticated, (req, res) => res.status(200).send({status: 'authenticated'}));
  app.post('/api/auth', Users.authenticate);
  app.post('/api/add-user', Users.addUser);
  app.post('/set-user', Users.isAuthenticated, Users.post);
};
