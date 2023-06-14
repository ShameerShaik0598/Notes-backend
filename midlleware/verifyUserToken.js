//import jwt
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.verifyUserToken = async (req, res, next) => {
  let signedToken = req.headers.authorization;
  console.log("testing verify");
  //if no token available
  if (signedToken == undefined) {
    res.send({ message: "unauthorization access" });
  } else {
    let token = signedToken.split(" ")[1];
    console.log(token);
    try {
      let verify = jwt.verify(token, process.env.SECRET_KEY);

      console.log("middleware user ", verify);
      req.userId = verify.user_id;
      next();
    } catch (err) {
      console.log("err ctach");
      res.send({ message: "Session expired...please login again" });
    }
  }
};
