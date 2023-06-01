//import jwt
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.verifyUserToken = async (req, res, next) => {
  let signedToken = req.headers.authorization;
  //if no token available
  if (signedToken == undefined) {
    res.send({ message: "unauthorization access" });
  } else {
    let token = signedToken.split(" ")[1];
    try {
      let verify = jwt.verify(token, process.env.SECRET_KEY);
      
      console.log("middleware user ", verify);
      req.userId = verify.user_id
      next();
    } catch (err) {
      res.send({ message: "Seesion expired...please login again" });
    }
  }
};
