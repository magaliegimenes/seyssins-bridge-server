'use strict';

const ActualityModel = require('./actualities.model');

module.exports.get = (req, res) => {
  return ActualityModel.find()
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
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};
