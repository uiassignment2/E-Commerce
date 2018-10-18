const Models = require('../models');
const mongoose = require('mongoose');

class UserService {

    async saveUser(user) {
        return await user.save();
    }

    async createUser(document) {
        return await Models.users.create(document);
    }

    findUser(query, projections) {
        return Models.users.findOne(query, projections).exec();
    }

    updateUser(query, updateObj, options) {
        return Models.users.update(query, updateObj, options).exec();
    }

    getProducts(){
      console.log("fjdggf");
        return Models.products.find().exec()
    }

    getProductDetail(id){
        return Models.products.findOne({"_id":id}).exec()
    }

    async checkCart(document){
        console.log(document);
        return await Models.carts.find({"userId":document.userId,"productId":document.productId,"isOrdered":false}).exec()
    }

    async addCartData(document) {
        
        return await Models.carts.create(document);
    }


    async updateCartData(filter,update) {
      console.log("here",filter)
        return await Models.carts.update(filter,update).exec();
    }

    async getCartData(userId){
      console.log("check",userId,typeof(userId));
      return await Models.carts.aggregate([
        {
           "$match":{"userId":mongoose.Types.ObjectId(userId),"isOrdered":false}
         },
         {
             $lookup:{
               from: 'users',
               localField:'userId' ,
               foreignField:'_id',
               as: "userInfo"
             }
          },{$unwind:
          {
             "path":"$userInfo",
             "preserveNullAndEmptyArrays":true
          }
          },
          {
              $lookup:{
                from: 'products',
                localField:'productId' ,
                foreignField:'_id',
                as: "productInfo"
              }
           },{$unwind:{
              "path":"$productInfo",
              "preserveNullAndEmptyArrays":true
           }},{
              $project:{
                 _id:1,
                 userId:1,
                 productId:1,
                 quantity:1,
                 prodDesc :"$productInfo.description",
                 prodPrice : "$productInfo.pricing",
                 prodImage : "$productInfo.image",
                 prodShipCost :"$productInfo.shippingCost",
                 userName : "$userInfo.userName",
                 userEmail: "$userInfo.email",
                 userAddress : "$userInfo.shippingAddress"
              }

           }
      ]).exec();
    }

    async editCartQuantity(filter,update) {
      console.log("here",filter)
        return await Models.carts.update(filter,update).exec();
    }

    async removeCart(document){
      console.log(document)
       return await Models.carts.update({"_id":document.cartId},{"$set":{"isOrdered":true}}).exec()
    }

    async removeCartData(document){
       return await Models.carts.remove(document).exec()
    }

    async saveOrder(document) {
      console.log("document",document)
        return await Models.orders.create(document);
    }

    async provideFeedback(document){
      return await Models.comments.create(document);
    }

    async getUserInfo(id){
      return await Models.users.findOne({"_id":id}).exec();
    }

    async editUserInfo(filter,update){
      return await Models.users.update(filter,update).exec();
    }

    async deleteComment(filter,update){
      return await Models.comments.update(filter,update).exec();
    }

    async getAllComments(id){
      return await Models.comments.aggregate([
        {
           "$match":{"productId":mongoose.Types.ObjectId(id),"isDeleted":false}
         },
         {
             $lookup:{
               from: 'users',
               localField:'userId' ,
               foreignField:'_id',
               as: "userInfo"
             }
          },{$unwind:
          {
             "path":"$userInfo",
             "preserveNullAndEmptyArrays":true
          }
          },
          {
              $lookup:{
                from: 'products',
                localField:'productId' ,
                foreignField:'_id',
                as: "productInfo"
              }
           },{$unwind:{
              "path":"$productInfo",
              "preserveNullAndEmptyArrays":true
           }},{
              $project:{
                 _id:1,
                 userId:1,
                 productId:1,
                 rating:1,
                 text:1,
                 prodDesc :"$productInfo.description",
                 prodPrice : "$productInfo.pricing",
                 prodImage : "$productInfo.image",
                 prodShipCost :"$productInfo.shippingCost",
                 userName : "$userInfo.userName",
                 userEmail: "$userInfo.email",
                 userAddress : "$userInfo.shippingAddress"
              }

           }
      ]).exec();
    }

    async changePassword(filter,update){
      return await Models.users.update(filter,update).exec();
    }

    async getAllOrders(id){
      return await Models.orders.aggregate([
        {
              $lookup:{
                from: 'carts',
                localField:'cartId' ,
                foreignField:'_id',
                as: "cartInfo"
              }
           },{$unwind:
           {
              "path":"$cartInfo",
              "preserveNullAndEmptyArrays":true
           }},
           {"$match":{"cartInfo.userId":mongoose.Types.ObjectId(id)}}
           ]).exec()
    } 
    
    async addProduct(document){
       return await Models.products.create(document)
    }


}

module.exports = new UserService();
