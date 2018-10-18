var nodemailer = require("nodemailer"),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    algorithm = 'aes-256-ctr';

var privateKey = process.env.PWD_KEY;


exports.decrypt = function(password) {
    return decrypt(password);
};

exports.encrypt = function(password) {
  console.log("i reach here",password);
    return encrypt(password);
};



// method to decrypt data(password)
function decrypt(password) {
    var decipher = crypto.createDecipher(algorithm, privateKey);
    console.log("decipher",decipher,password);
    var dec = decipher.update(password, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

// method to encrypt data(password)
function encrypt(password) {
  console.log("pass",password);
    var cipher = crypto.createCipher(algorithm, privateKey);
    console.log("cipher",cipher)
    var crypted = cipher.update(password, 'utf8', 'hex');
    crypted += cipher.final('hex');
    console.log("crypted",crypted);
    return crypted;
}

exports.getToken = function (tokenData) {
    let secretKey = process.env.JWT || 'jwtkey';
    return jwt.sign(tokenData, secretKey, {expiresIn: '18h'});
}
exports.getUserId = function (token) {
    let secretKey = process.env.JWT || 'jwtkey';
    var tokenDecode = jwt.verify(token, secretKey);
    return tokenDecode.id;
}

exports.successResponse = function (message, data) {
    return {
        "statusCode": 200,
        "data": data,
        "message": message
    }
}

exports.failureResponse = function (message, data) {
    return {
        "statusCode": 400,
        "data": data,
        "message": message
    }
}

exports.forbiddenResponse = function(message,data){
  return {
      "statusCode": 403,
      "data": data,
      "message": message
  }
}
