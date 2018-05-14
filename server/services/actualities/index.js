'use strict';

const ActualityModel = require('./actualities.model');
const UserModel = require('../users/users.model').UserModel;

const Mail = require('../../core/mail');
const Files = require('../../core/file');

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


module.exports.uploadFile = (req, res) => {
  let id = req.params.id;
  return ActualityModel.findOne({_id: id})
    .then(actuality => Files.uploadFile(actuality, req.file))
    .then(actuality => actuality.save())
    .then(actuality => res.send(actuality))
    .catch(err => {
      console.log(err);
      res.status(500).send({message: 'Upload not achieved', code: err.code, error: err});
    })
};

module.exports.getFile = (req, res) => {
  let id = req.params.id;
  return ActualityModel.findOne({_id: id})
    .then(actuality => Files.getFile(actuality))
    .then(urlData => res.send(urlData))
    .catch(err => {
      console.log(err);
      res.status(500).send({message: 'File not found'});
    })
};


module.exports.delete = (req, res) => {
  let id = req.params.id;
  return ActualityModel.remove({_id: id})
    .then((actualityDeleted) => {
      if (actualityDeleted.dropboxPath) {
        return Files.deleteFile(actualityDeleted.dropboxPath)
          .then(() => console.log('Dropbox file deletion has completed', actualityDeleted.dropboxPath))
          .catch((err) => console.log('Dropbox file deletion has failed after clublife deletion', err));
      }
    })
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
