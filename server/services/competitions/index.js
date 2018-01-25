'use strict';

const CompetitionModel = require('./competitions.model');
const UserModel = require('../users/users.model').UserModel;

const Mail = require('../../core/mail');
const Files = require('../../core/file');

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
    .then(() => {
      const subject = 'Nouveauté sur le site de Seyssins Bridge !';
      const html = `<h3>${competition.title}</h3>${competition.message}`;
      Mail.createCampaign(subject, html);
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
