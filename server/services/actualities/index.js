'use strict';

const ActualityModel = require('./actualities.model');
const UserModel = require('../users/users.model').UserModel;
const Files = require('../../core/file');
const Mail = require('../../core/mail');

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
    .then(() => {
      const subject = 'Nouveauté sur le site de Seyssins Bridge !';
      const html = `<h3>${actuality.title}</h3>${actuality.message}`;
      Mail.createCampaign(subject, html);
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

module.exports.uploadPicture = (req, res) => {
  let id = req.params.id;
  return ActualityModel.findOne({_id: id})
    .then(actuality => Files.uploadPicture(actuality, req.files))
    .then(actuality => res.send(actuality))
};
