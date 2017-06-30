'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
const UserModel = require('./users.model');

module.exports.isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, config.get('authentication').secret, function(err) {
    if (err) {
      res.status(401).send({message: err.message});
      return;
    }
    next();
  });
};

module.exports.authenticate = (req, res) => {
  let user;
  UserModel.findOne({
    username: req.body.username
  })
    .then(userFromDB => {
      if (!userFromDB) {
        throw new Error('User does not exist');
      }
      user = userFromDB;
      // todo check password
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(doesMatch => {
      if (doesMatch) {
        // if user is found and password is right
        // create a token
        const token = jwt.sign(user, config.get('authentication').secret, {
          expiresIn: 3600 // expires in 1 hour
        });

        // return the information including token as JSON
        res.json({
          success: true,
          token: token
        });
      } else {
        // if user is found and password is wrong
        res.status(401).json({
          success: false,
          message: 'password does not match'
        });
      }
    })
    .catch(err => {
      res.status(401).send({
        status: 'failed',
        message: err.message
      })
    })
};

module.exports.post = (req, res) => {
  bcrypt.hash('admin-pwd', 10)
    .then(hash => {
      const user = new UserModel({
        username: 'bridge-admin',
        password: hash,
        admin: true
      });
      console.log(user);
      return user.save();
    })
    .then(user => {
      res.status(200).send(user);
    })
    .catch(err => {
      res.status(500).send({
        status: 'failed',
        message: err.message
      })
    });
};
