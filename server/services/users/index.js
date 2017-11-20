'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
const AdminModel = require('./users.model').AdminModel;
const Mail = require('../../core/mail');

module.exports.isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, config.get('authentication').secret, function (err) {
    if (err) {
      res.status(401).send({message: err.message});
      return;
    }
    next();
  });
};

module.exports.authenticate = (req, res) => {
  let admin;
  AdminModel.findOne({
    username: req.body.username
  })
    .then(adminFromDB => {
      if (!adminFromDB) {
        throw {code: 404, message: 'User does not exist'};
      }
      admin = adminFromDB;
      // todo check password
      return bcrypt.compare(req.body.password, admin.password);
    })
    .then(doesMatch => {
      if (doesMatch) {
        // if user is found and password is right
        // create a token
        const token = jwt.sign(admin, config.get('authentication').secret, {
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
          code: 403,
          success: false,
          message: 'password does not match'
        });
      }
    })
    .catch(err => {
      res.status(401).send({
        code: err.code || '500',
        status: 'failed',
        message: err.message || 'Unknown error'
      })
    })
};

module.exports.post = (req, res) => {
  bcrypt.hash('admin-pwd', 10)
    .then(hash => {
      const admin = new AdminModel({
        username: 'bridge-admin',
        password: hash,
        admin: true
      });
      return admin.save();
    })
    .then(admin => {
      res.status(200).send(admin);
    })
    .catch(err => {
      res.status(500).send({
        status: 'failed',
        message: err.message
      })
    });
};

module.exports.addUser = (req, res) => {
  Mail.addUserToList(req.body.email)
    .then(() => {
      res.status(200).send({message: 'email has subscribed to list'});
    })
    .catch(err => {
      switch (err.error.title) {
        case 'Member Exists' :
          res.status(500).send({
            code: 403,
            message: 'email has already subscribed'
          });
          break;
        case 'Invalid Resource' :
          res.status(500).send({
            code: 401,
            message: 'email is not valid'
          });
          break;
        default:
          res.status(500).send({
            code: 500,
            message: err.error
          });
          break;
      }
    });
};
