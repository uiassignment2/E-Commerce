'use strict';
/**
 * Product Model
 **/
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 // bcrypt = require('bcrypt'),
 moment = require('moment');

 var productSchema = new Schema({
  description : String,
  image : String,
  pricing : Number,
  shippingCost : Number,
  createdAt   : {
    type      : Date,
    default   : Date.now()
  },
  updatedAt   :  {
    type      : Date,
    default   : Date.now()
  },
});

module.exports = mongoose.model('products', productSchema);
