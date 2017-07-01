'use strict';

const ActualityModel = require('./actualities.model');

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
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};

module.exports.put = (req, res) => {
  console.log('test0 ' + req.params.id);
  return ActualityModel.update({_id: req.params.id}, req.body).exec()
    .then(() => {
      console.log('test ' + req.params.id);
      return ActualityModel.findOne({_id: req.params.id}).exec();
    })
    .then(actuality => {
      console.log(actuality);
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
