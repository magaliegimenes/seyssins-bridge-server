'use strict';
const nodemailer = require('nodemailer');
const _ = require('lodash');

const ActualityModel = require('./actualities.model');
const UserModel = require('../users/users.model').UserModel;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'noreply.seyssins.bridge@gmail.com', // Your email id
    pass: 'Seyssins38' // Your password
  }
});

module.exports.get = (req, res) => {
  return ActualityModel.find().sort('-createdAt')
    .then(actualities => {
      res.send(actualities);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      })
    });
};

module.exports.post = (req, res) => {
  let actuality = new ActualityModel(req.body);
  return actuality.save()
    .then(actualitySaved => {
      res.send(actualitySaved);
      return UserModel.find().exec();
    })
    .then(users => {
      const mailOptions = {
        from: 'noreply.seyssins.bridge@gmail.com',
        to: _.map(users, 'email'),
        subject: 'Nouveauté sur le site de Seyssins!',
        html: `<h3>${actuality.title}</h3>${actuality.message}`
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log('Mail was not sent.');
          console.log(error);
        } else {
          console.log('Message sent: ' + info.response);
        }
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};

module.exports.put = (req, res) => {
  return ActualityModel.findOneAndUpdate({_id: req.params.id}, req.body).exec()
    .then(actuality => {
      res.send(actuality);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};

module.exports.delete = (req, res) => {
  let id = req.params.id;
  return ActualityModel.remove({_id: id})
    .then(() => {
      res.send({message: 'actuality deleted'});
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};
