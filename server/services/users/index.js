const jwt = require('jsonwebtoken');
const config = require('config');
const UserModel = require('./users.model');

module.exports.authenticate = (req, res) => {
  UserModel.findOne({
    username: req.body.username
  })
    .then(user => {
      if (!user) {
        throw new Error('User does not exist');
      }
      // todo check password

      // if user is found and password is right
      // create a token
      var token = jwt.sign(user, config.get('authentication').secret, {
        expiresIn: 3600 // expires in 1 hour
      });

      // return the information including token as JSON
      res.json({
        success: true,
        token: token
      });
    })
    .catch(err => {
      res.status(401).send({
        status: 'failed',
        message: err.message
      })
    })
}
