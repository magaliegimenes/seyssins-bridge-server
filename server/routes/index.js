const Actualities = require('../services/actualities');
const Users = require('../services/users');

module.exports.init = (app) => {
  app.get('/api/actualities', Actualities.get);
  app.post('/api/actualities', Actualities.post);
  app.post('/auth', Users.authenticate);
};
