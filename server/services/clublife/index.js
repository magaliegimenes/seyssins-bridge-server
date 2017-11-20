'use strict';
const request = require('request');

const Mail = require('../../core/mail');
const _ = require('lodash');

const ClublifeModel = require('./clublife.model');


module.exports.get = (req, res) => {
  return ClublifeModel.find().sort('-createdAt')
    .then(clublife => {
      res.send(clublife);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      })
    });
};

module.exports.post = (req, res) => {
  const clublife = new ClublifeModel(req.body);
  return clublife.save()
    .then(clublifeSaved => {
      res.send(clublifeSaved);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
      throw err;
    })
    .then(() => {
      const subject = 'Nouveauté sur le site de Seyssins!';
      const html = `<h3>${clublife.title}</h3>${clublife.message}`;
      Mail.createCampaign(subject, html);
    });
};

module.exports.put = (req, res) => {
  return ClublifeModel.findOneAndUpdate({_id: req.params.id}, req.body).exec()
    .then(clublife => {
      res.send(clublife);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};

module.exports.delete = (req, res) => {
  let id = req.params.id;
  return ClublifeModel.remove({_id: id})
    .then(() => {
      res.send({message: 'clublife info deleted'});
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};
