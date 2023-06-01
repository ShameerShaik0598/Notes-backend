//import routes
const express = require("express");

//create a router
const UserApp = express.Router();

//import controllers
const {
  test,
  userRegistration,
  userLogin,
} = require("../controllers/user.controller");

//Routes

//testing the route
UserApp.get("/test", test);

//Route for user registration
UserApp.post("/user-registration", userRegistration);

//Route for user login
UserApp.post("/user-login", userLogin);

module.exports = UserApp;
