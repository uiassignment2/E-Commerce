'use strict';
/**
 * Comment Model
 **/
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 // bcrypt = require('bcrypt'),
 moment = require('moment');

 var commentSchema = new Schema({
  productId   : {ref: 'productSchema', type : mongoose.Schema.ObjectId },
  userId      : {ref: 'userSchema', type : mongoose.Schema.ObjectId },
  rating      : Number,
  isDeleted   : {
    type : Boolean,
    default : false
  },
  images      : Array,
  text        : String,
  createdAt   : {
    type      : Date,
    default   : Date.now()
  },
  updatedAt   :  {
    type      : Date,
    default   : Date.now()
  },
});

module.exports = mongoose.model('comments', commentSchema);
