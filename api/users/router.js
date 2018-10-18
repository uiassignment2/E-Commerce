const express = require('express');
const controller = require('./controller');
const validation = require('./validation');
const auth = require('../middleware');

module.exports = express
  .Router()
  .post('/register',validation.create, controller.create)
  .post('/login',validation.login, controller.login)
  .get('/getProducts',controller.getProducts)
  .get('/getProductDetail',controller.getProductDetail)
  .post('/addCartData',controller.addCartData)
  .get('/getCartData',controller.getCartData)
  .put('/editCartQuantity',controller.editCartQuantity)
  .post('/saveOrder',controller.saveOrder)
  .get('/getUserInfo',controller.getUserInfo)
  .post('/editUserInfo',controller.editUserInfo)
  .get('/getAllComments',controller.getAllComments)
  .post('/upload',controller.provideFeedback)
  .post('/deleteComment',controller.deleteComment)
  .post('/changePassword',controller.changePassword)
  .get('/getAllOrders',controller.getAllOrders)
  .post('/removeCart',controller.removeCartData)
  .post('/addComment',controller.addComment)
  .post('/addProduct',controller.addProduct)