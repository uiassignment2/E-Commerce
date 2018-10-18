const jwtToken = require('../lib/auth');

exports.verifyJWT_MW = function (req, res, next) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    let token = req.headers.authorization.split(' ')[1];
    jwtToken.verifyJWTToken(token)
      .then((decodedToken) => {
        req.user = decodedToken;
        next();
      })
      .catch((err) => {
        req.user = undefined;
        res.send({ message: "Invalid auth token provided." });
      })
  } else {
    req.user = undefined;
    res.send({ message: "Auth token type missing." });
  }

}