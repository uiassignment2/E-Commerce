const { userServices } = require('../api/services');

class CommonFunctions {

  async validateEmail(payload) {
    console.log("payload",payload)
    try {
      let query = {};
      if (payload.email) {
        query = {
          email: payload.email
        }
      } else if (payload.token) {
        query = {
          "resetPassword.token" :payload.token
        }
      }
      console.log("query",query);
      let users = await userServices.findUser(query);
      console.log("users",users);
      return users;
    } catch (err) {
      throw new Error(err);
    }

  }
}

module.exports = new CommonFunctions();
