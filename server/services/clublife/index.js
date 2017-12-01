'use strict';
const request = require('request');

const Mail = require('../../core/mail');
const Files = require('../../core/file');

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
      const subject = 'Nouveauté sur le site de Seyssins Bridge !';
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
  return ClublifeModel.findOneAndRemove({_id: id})
    .then((clDeleted) => {
      if (clDeleted.dropboxPath) {
        return Files.deleteFile(clDeleted.dropboxPath)
          .then(() => console.log('Dropbox file deletion has completed', clDeleted.dropboxPath))
          .catch((err) => console.log('Dropbox file deletion has failed after clublife deletion', err));
      }
    })
    .then(() => res.send({message: 'Clublife info deleted'}))
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message: err.message
      });
    });
};


module.exports.uploadFile = (req, res) => {
  let id = req.params.id;
  return ClublifeModel.findOne({_id: id})
    .then(clublife => Files.uploadFile(clublife, req.file))
    .then(clublife => clublife.save())
    .then(clublife => res.send(clublife))
    .catch(err => {
      console.log(err);
      res.status(500).send({message: 'Upload not achieved', code: err.code, error: err});
    })
};

module.exports.getFile = (req, res) => {
  let id = req.params.id;
  return ClublifeModel.findOne({_id: id})
    .then(clublife => Files.getFile(clublife))
    .then(urlData => res.send(urlData))
    .catch(err => {
      console.log(err);
      res.status(500).send({message: 'File not found'});
    })
};
