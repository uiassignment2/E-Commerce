const Joi = require('joi');

class UserValidations{
    constructor(){}

    create(req,res,next){
        const schema = Joi.object().keys({
            userName: Joi.string().required(),
            password: Joi.string().required(),
            email: Joi.string().email().required(),
            shippingAddress: Joi.string().required()
        });
        Joi.validate(req.body, schema, function (err, value) {
            if(err){
                next(err);
            }else{
                next();
            }
         });
    }

    login(req,res,next){
        const schema = Joi.object().keys({
            password: Joi.string().required(),
            email: Joi.string().email().required()
        });
        Joi.validate(req.body, schema, function (err, value) {
            if(err){
                next(err);
            }else{
                next();
            }
        });
    }

    resetPassword(req,res,next){
        const schema = Joi.object().keys({
            email:Joi.string().email().required(),
            verificationCode: Joi.object().keys({
                token:Joi.string().required(),
                two_factor_temp_secret:Joi.string().required()
            }),
            password: Joi.string().required()
        });
        Joi.validate(req.body, schema, function (err, value) {
            if(err){
                next(err);
            }else{
                next();
            }
        });
    }

    changePassword(req,res,next){
        const schema = Joi.object().keys({
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().required()
        });
        Joi.validate(req.body, schema, function (err, value) {
            if(err){
                next(err);
            }else{
                next();
            }
        });
    }

    forgotPassword(req,res,next){
        const schema = Joi.object().keys({
            email: Joi.string().email().required()
        });
        Joi.validate(req.body, schema, function (err, value) {
            if(err){
                next(err);
            }else{
                next();
            }
        });
    }
}

module.exports = new UserValidations();
