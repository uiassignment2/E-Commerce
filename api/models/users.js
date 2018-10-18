'use strict';
/**
 * User Model
 **/
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 // bcrypt = require('bcrypt'),
 moment = require('moment');

 var usersSchema = new Schema({
  userName   : String,
  email       : {
    type      : String,
    unique    : true,
    lowercase : true,
    required  : true
  },
  shippingAddress : String,
  purchaseHistory : Array,
  password    : String,
  createdAt   : {
    type      : Date,
    default   : Date.now()
  },
  updatedAt   :  {
    type      : Date,
    default   : Date.now()
  },
});

module.exports = mongoose.model('users', usersSchema);
