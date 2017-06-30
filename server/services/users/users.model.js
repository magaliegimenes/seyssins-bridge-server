'use strict';

// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('users', new Schema({
  username: { type : String , unique : true, required : true, dropDups: true },
  password: { type : String, required : true },
  admin: { type : Boolean , default : false }
}, {timestamps: true}));
