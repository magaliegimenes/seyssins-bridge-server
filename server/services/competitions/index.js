'use strict';
const nodemailer = require('nodemailer');
const _ = require('lodash');

const CompetitionModel = require('./competitions.model');
const UserModel = require('../users/users.model').UserModel;
const Files = require('../files');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'noreply.seyssins.bridge@gmail.com', // Your email id
    pass: 'Seyssins38' // Your password
  }
});

module.exports.get = (req, res) => {
  return CompetitionModel.find().sort('-createdAt')
    .then(competitions => {
      res.send(competitions);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      })
    });
};

module.exports.post = (req, res) => {
  let competition = new CompetitionModel(req.body);
  return competition.save()
    .then(competitionSaved => {
      res.send(competitionSaved);
      return UserModel.find().exec();
    })
    .then(users => {
      const mailOptions = {
        from: 'noreply.seyssins.bridge@gmail.com',
        bcc: _.map(users, 'email'),
        subject: 'Nouveauté sur le site de Seyssins!',
        html: `<h3>${competition.title}</h3>${competition.message}`
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
  return CompetitionModel.findOneAndUpdate({_id: req.params.id}, req.body).exec()
    .then(competition => {
      res.send(competition);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};

module.exports.delete = (req, res) => {
  let id = req.params.id;
  return CompetitionModel.remove({_id: id})
    .then(() => {
      res.send({message: 'competition deleted'});
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};

module.exports.uploadPicture = (req, res) => {
  let id = req.params.id;
  return CompetitionModel.findOne({_id: id})
    .then(competition => Files.uploadPicture(competition, req.files))
    .then(competition => res.send(competition))
};
