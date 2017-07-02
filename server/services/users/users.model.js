'use strict';

// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports.AdminModel = mongoose.model('admins', new Schema({
  username: { type : String , unique : true, required : true, dropDups: true },
  password: { type : String, required : true },
  admin: { type : Boolean , default : false }
}, {timestamps: true}));

// set up a mongoose model and pass it using module.exports
module.exports.UserModel = mongoose.model('users', new Schema({
  email: { type : String , unique : true, required : true, dropDups: true }
}, {timestamps: true}));
