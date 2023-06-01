//import express-async-handler
const expresAsyncHandler = require("express-async-handler");

//import bcryptjs
const bcryptjs = require("bcryptjs");

//import jwt
const jwt = require("jsonwebtoken");

//import the models
const { User } = require("../database/models/user.model");

//import dotenv
require("dotenv").config();

//Controllers

//Testing the controller
exports.test = (req, res) => {
  res.send({ message: "User Api testing succesfull" });
};

//User Registration Controller
exports.userRegistration = expresAsyncHandler(async (req, res) => {
  try {
    let { email, password } = req.body;
    let userRecord = await User.findOne({
      where: {
        email: email,
      },
    });
    if (userRecord == undefined) {
      let hashedPassword = await bcryptjs.hash(password, 5);
      req.body.password = hashedPassword;

      //create user
      let user = await User.create(req.body);
      //send new user details
      res.send({ message: "User Registered Successfully", payload: user });
    } else {
      res.send({ message: "user already exists" });
    }
  } catch (err) {
    //if user already exists
    res.send({ message: "Registration Failed" });
  }
});

//User Login Controller
exports.userLogin = expresAsyncHandler(async (req, res) => {
  let user = await User.findOne({
    where: {
      email: req.body.email,
      status: true,
    },
  });
  //if the user is not found
  if (user == null)
    res.send({
      message: "Email is not registered....Please register to Login",
    });
  //else if the user is found
  else {
    //compare the password with hashed password in database
    if (await bcryptjs.compare(req.body.password, user.password)) {
      user = user.toJSON();
      delete user.password;
      delete user.createdAt;
      delete user.updatedAt;
      //generate a token
      let signedToken = jwt.sign(user, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      //when the request is made send the token as response
      res.send({
        message: "success",
        payload: user,
        token: signedToken,
      });
    } else {
      res.send({ message: "Invalid Credentials" });
    }
  }
});
