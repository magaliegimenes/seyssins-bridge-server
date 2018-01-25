'use strict';

const mongoose = require('mongoose');
const config = require('config');

class Database {

  constructor() {
    this.connection = null;
  }

  connectDB() {
    let mongoURL = process.env.MONGO_URL || config.get('mongodb');

    if (!mongoURL) {
      return Promise.reject();
    }

    mongoose.Promise = global.Promise;
    return mongoose.connect(mongoURL)
      .then(() => {

        this.connection = mongoose.connection;

        console.log('Connected to MongoDB at: %s', mongoURL);
      });

  };

  get get() {
    return this.connection.db;
  }
}

module.exports = new Database();
