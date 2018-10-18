'use strict';
/**
 * Comment Model
 **/
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 // bcrypt = require('bcrypt'),
 moment = require('moment');

 var orderSchema = new Schema({
  cartId   : {ref: 'cartSchema', type : mongoose.Schema.ObjectId },
  createdAt   : {
    type      : Date,
    default   : Date.now()
  },
  updatedAt   :  {
    type      : Date,
    default   : Date.now()
  },
});

module.exports = mongoose.model('orders', orderSchema);
