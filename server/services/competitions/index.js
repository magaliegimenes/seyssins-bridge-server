'use strict';

const CompetitionModel = require('./competitions.model');

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
