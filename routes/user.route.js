//import routes
const express = require("express");

//create a router
const UserApp = express.Router();

//import controllers
const {
  test,
  userRegistration,
  forgetPassword,
  resetPassword,
  userLogin,
} = require("../controllers/user.controller");

//Routes

//testing the route
UserApp.get("/test", test);

//Route for user registration
UserApp.post("/user-registration", userRegistration);

//Route for user login
UserApp.post("/user-login", userLogin);

//Route for Forget password
UserApp.post("/forgot-password", forgetPassword);

//Route for reset-password
UserApp.post("/reset-password/email/:email", resetPassword);

module.exports = UserApp;
