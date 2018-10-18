const { userServices } = require('../services/index');
const jwtToken = require('../../lib/auth');
const { EMAIL ,USER_TYPE } = require('../../lib/constant');
const { SUCCESS_MESSAGE, ERROR_MESSAGE } = require('../../lib/message');
const commonFunctions = require('../../lib/common');
const emailProvider = require('../../lib/email-provider');
const logger = require('../../lib/logger');
const mongoose = require('mongoose').Types;
const customError = require('../../lib/custom-error');
const util = require('../../lib/util');
const common = require('../../config/common');
var fs = require('fs');


class Controller {

  async create(req, res, next) {
    try {
        let obj = {
            "password":req.body.password,
            "userName":req.body.userName,
            "email":req.body.email,
            "shippingAddress":req.body.shippingAddress
        }

        let validateEmail = await commonFunctions.validateEmail(obj);
        if (validateEmail) {
          return next(new customError(ERROR_MESSAGE.EMAIL_EXIST));
        }
        let user = await userServices.createUser(obj);
        res.send({ status: 1, code: 200, message: SUCCESS_MESSAGE.SUCCESS, data: user });

    } catch (err) {
      res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
    }
  }

  async login(req, res,next) {
    try {
      console.log("fdgddgdfg")
      let payload = req.body;
      let user = await commonFunctions.validateEmail(payload);
      console.log("user",user);
      if (user) {
          if(req.body.password === user.password){
          let { firstName, lastName, email, _id } = user;
          let token = jwtToken.createJWToken({
            sessionData: { firstName, lastName, email, _id },
            maxAge: 3600
          });
          logger.logResponse(req.id, res.statusCode, 200);
          res.send({ status: 1, code: 200, message: SUCCESS_MESSAGE.SUCCESS, user })
        }else{
          res.send({ status: 1, code: 400, message: "Invalid Password" })
        }
      } else {
        next(new customError(ERROR_MESSAGE.INVALID_EMAIL));
      }
    } catch (err) {
      res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
    }
  }

 async provideFeedback(req, res, next) {
    try{
      console.log("hdhdfjf",req.files); 
      var path = require('path');
      console.log(req.files,"Test123")
      if(req.files){
      let name = req.files.images;
      let images = [];
      if(name.length && name.length!=undefined){
        let flag  = 0;
        path = path.join(__dirname,'./../../public/images/');
        for(var i = 0;i<name.length;i++){
          let fileName = name[i].name;
          console.log("fileName",fileName)
          name[i].mv(path + fileName ,async function(err) {
          if (err){
            console.log("Error111",err);
            res.send({ status: 1, code: 400, message: "Error Uploading Image"})
          }else{
            images.push("/images/"+fileName)
            flag ++;
            if(flag == name.length){
              var obj = req.body;
              obj.images = images;
              let data = await userServices.provideFeedback(obj);
              console.log("dhjgfdhgfd",data);
               res.send({ status: 1, code: 200, message: "SUCCESS",data})
            }
          }
        });
        }
      }else{
        path = path.join(__dirname,'./../../public/images/');
          let fileName = name.name;
          name.mv(path + fileName ,async function(err) {
          if (err){
            console.log("error",err);
            res.send({ status: 1, code: 400, message: "Error Uploading Image"})
          }else{
            images.push("/images/"+fileName)
              var obj = req.body;
              obj.images = images;
              let data = await userServices.provideFeedback(obj);
               res.send({ status: 1, code: 200, message: "SUCCESS",data})

          }
        });
      }
    }else{
       var obj = req.body;
      //  console.log("obj",JSON.parse(JSON.stringify(obj)))
       let data = await userServices.provideFeedback(obj);
       res.send({ status: 1, code: 200, message: "SUCCESS",data})
    }
    }catch(err){
      console.log("errrosddr",err);
      res.send({ status: 0, code: 404, message:"Error", data: err });
    }

 }

  async getProducts(req,res) {
     try {
       let data = await userServices.getProducts();
       res.send({ status: 1, code: 200, message: SUCCESS_MESSAGE.SUCCESS,data})
     }catch(err){
       res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
     }
  }

  async getProductDetail(req,res) {
     try {
       let id = req.query.id;
       let data = await userServices.getProductDetail(id);
       let rating = await userServices.getAllComments(id);
       console.log("information",data,rating);
       var sum = 0;
       for(var i=0;i<rating.length;i++){
           sum = sum +rating[i].rating;
       }
       var avg = sum/rating.length;
       console.log("avg",avg);
       var obj = {};
       obj.data = data;
       obj.rating = avg;
       res.send({ status: 1, code: 200, message: SUCCESS_MESSAGE.SUCCESS,obj})
     }catch(err){
       console.log("Error????",err);
       res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
     }
  }

  async addCartData(req,res) {
     try{
       if(!req.body.userId){res.send({ status: 0, code: 400, message:"UserId is required."})}
       if(!req.body.productId){res.send({ status: 0, code: 400, message:"ProductId is required."})}
       if(!req.body.quantity){res.send({ status: 0, code: 400, message:"Quantity is required."})}
       let obj = {
          "quantity":req.body.quantity,
          "userId":req.body.userId,
          "productId":req.body.productId
       }
       let checkCart = await userServices.checkCart(obj);
       if(checkCart && checkCart.length){
         if(checkCart[0].quantity>=5){
          res.send({ status: 1, code: 400, message: "Sorry! No more item can be added to your cart"})
         }else{
          let filter = {
            "userId":req.body.userId,
            "productId":req.body.productId,
            "isOrdered":false
        }
        let obj = {
           "quantity":checkCart[0].quantity + 1
        }
        let data = await userServices.updateCartData(filter,obj);
        console.log(data,"data")
        res.send({ status: 1, code: 200, message: SUCCESS_MESSAGE.SUCCESS,data})
         }
  
       }else{
         let data = await userServices.addCartData(obj);
         res.send({ status: 1, code: 200, message: SUCCESS_MESSAGE.SUCCESS,data})
       }
       
     }catch(err){
       res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
     }
  }

  async getCartData(req,res){
    try{
      console.log(req.query);
      if(!req.query.userId){res.send({ status: 0, code: 400, message:"UserId is required."})}
      let userId = req.query.userId;
      let data = await userServices.getCartData(userId);
      res.send({ status: 1, code: 200, message: SUCCESS_MESSAGE.SUCCESS,data})
    }catch(err){
      res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
    }
  }

  async editCartQuantity(req,res){
    try{
      if(!req.query.cartId){res.send({ status: 0, code: 400, message:"CartId is required."})}
      let filter = {
         "_id":req.query.cartId
      }
      let objToUpdate = {
         "quantity":req.body.quantity
      }
      let data = await userServices.editCartQuantity(filter,objToUpdate);
      res.send({ status: 1, code: 200, message: SUCCESS_MESSAGE.SUCCESS,data})
    }catch(err){
      res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
    }
  }

  async saveOrder(req,res){
     try{ 
       console.log("123456",req.body.cartId[0],req.body.cartId[1]); 
       if(!req.body.cartId){res.send({ status: 0, code: 400, message:"CartId is required."})}
       var cartArray = req.body.cartId;

      for(var i=0;i<cartArray.length;i++){
        console.log("ffff",cartArray.length)
        let obj = { cartId : cartArray[i] }
        let data = await userServices.saveOrder(obj);
        console.log(data,"Test")
        let removeCart =  await userServices.removeCart(obj);
        console.log(removeCart,"Test")
        
      }
       res.send({ status: 1, code: 200, message:"Order Created Successfully"})
     }catch(err){
       res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
     }
  }

  async getUserInfo(req,res){
    try{
      if(!req.query.userId){res.send({ status: 0, code: 400, message:"UserId is required."})}
      let obj = {
         "userId":req.query.userId,
      };
      console.log("obj??",obj.userId)
      let data = await userServices.getUserInfo(obj.userId);
      res.send({ status: 1, code: 200, message:"User retrieved Successfully",data})
    }catch(err){
      res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
    }
  }

  async editUserInfo(req,res){
    try{
      if(!req.body.userId){res.send({ status: 0, code: 400, message:"UserId is required."})}
      let filter = {
        "_id":req.body.userId
      }
         let obj = {
           "userName":req.body.userName,
           "shippingAddress":req.body.shippingAddress,
           "password":req.body.password
         }
      let data = await userServices.editUserInfo(filter,obj);
      res.send({ status: 1, code: 200, message:"Success",data})
    }catch(err){
      res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
    }
  }

  async getAllComments(req,res){
    try{
      if(!req.query.productId){res.send({ status: 0, code: 400, message:"ProductId is required."})}
      let obj = {
         "productId":req.query.productId,
      };
      let data = await userServices.getAllComments(obj.productId);
      res.send({ status: 1, code: 200, message:"Success",data})
    }catch(err){
      res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
    }
  }

  async deleteComment(req,res){
    try{
      console.log("23344",req.query.commentId);
      if(!req.query.commentId){res.send({ status: 0, code: 400, message:"CommentId is required."})}
      let filter = {
        "_id":req.query.commentId,
      }
      let obj = {
          "isDeleted":true
      }
      let data = await userServices.deleteComment(filter,obj);
      res.send({ status: 1, code: 200, message:"Success"})
    }catch(err){
      res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
    }
  }

  async changePassword(req,res){
    try{
      console.log(req.body.userId);
      let filter = {
        "_id":req.body.userId,
      }
      let obj = {
        "password":req.body.newPassword
      }
      let data = await userServices.changePassword(filter,obj);
      console.log("dhfsdgf",data);
      res.send({ status: 1, code: 200, message:"Password changed Successfully"})
    }catch(err){
      console.log(err,"bgjghbvf");
        res.send({ status: 0, code: 404, message:"Error" });
    }
  }

  async getAllOrders(req,res){
    try{
      if(!req.query.userId){res.send({ status: 0, code: 400, message:"UserId is required."})}
      let obj = {
         "userId":req.query.userId,
      };
      let data = await userServices.getAllOrders(obj.userId);
      res.send({ status: 1, code: 200, message:"Success",data})
    }catch(err){
      res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
    }
  }

  async removeCartData(req,res){
    try{
      if(!req.body.cartId){res.send({ status: 0, code: 400, message:"CartId is required."})}
      let obj = {
         "_id":req.body.cartId
      }
      let data = await userServices.removeCartData(obj);
      res.send({ status: 1, code: 200, message:"Cart Removed Successfully"})
    }catch(err){
      res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
    }
  }

  async addComment(req,res){
      try{
        console.log(req)
        var obj = req.body;
        let data = await userServices.provideFeedback(obj);
        console.log("dhjgfdhgfd",data);
        res.send({ status: 1, code: 200, message: "SUCCESS",data})
      }catch(err){
        res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
      }
  }

  
  async addProduct(req,res){
    try{
      console.log(req)
      var obj = req.body;
      let data = await userServices.addProduct(obj);
      res.send({ status: 1, code: 200, message: "SUCCESS",data})
    }catch(err){
      res.send({ status: 0, code: 404, message: ERROR_MESSAGE.ERROR, data: err.stack });
    }
}


}
module.exports = new Controller();
