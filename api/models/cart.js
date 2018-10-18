'use strict';
/**
 * Comment Model
 **/
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 // bcrypt = require('bcrypt'),
 moment = require('moment');

 var cartSchema = new Schema({
  productId   : {ref: 'productSchema', type : mongoose.Schema.ObjectId },
  userId      : {ref: 'userSchema', type : mongoose.Schema.ObjectId },
  isOrdered : {
    type : Boolean,
    default : false
  },
  quantity    : Number,
  createdAt   : {
    type      : Date,
    default   : Date.now()
  },
  updatedAt   :  {
    type      : Date,
    default   : Date.now()
  },
});

module.exports = mongoose.model('carts', cartSchema);
