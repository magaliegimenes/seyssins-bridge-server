'use strict';

const ActualityModel = require('./actualities.model');

module.exports.get = (req, res) => {
  return ActualityModel.find().sort('-createdAt')
    .then(actualities => {
      setTimeout(() => res.send(actualities), 10000);
      // res.send(actualities);
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
