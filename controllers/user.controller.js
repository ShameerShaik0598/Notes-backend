//import express-async-handler
const expresAsyncHandler = require("express-async-handler");

//import bcryptjs
const bcryptjs = require("bcryptjs");

//import jwt
const jwt = require("jsonwebtoken");

//import nodemailer
const nodemailer = require("nodemailer");

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
        expiresIn: "48h",
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

//create connection to smtp
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // password of app
  },
});

//Creating otps object
let otps = {};

//Forget password
exports.forgetPassword = expresAsyncHandler(async (req, res) => {
  //generating 6 digit random number as otp
  let otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  //add OTP to otps
  otps[req.body.email] = otp;
  //draft email
  let mailOptions = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: "OTP to reset password for project pulse",
    text:
      `Hi ,
         We received a request to reset yout project pulse password .Enter the following OTP to reset password :  
          ` + otp,
  };
  //send email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  //setting validity to OTP
  setTimeout(() => {
    //delete OTP from object
    delete otps[req.body.email];
  }, 600000);
  res.send({
    message: "OTP to reset your password is sent to your email",
    otp,
  });
});

//reset password

exports.resetPassword = expresAsyncHandler(async (req, res) => {
  //otp matches
  if (req.body.otp == otps[req.params.email]) {
    console.log("password verififed");
    await User.update(
      { password: req.body.password },
      {
        where: {
          email: req.params.email,
        },
      }
    );
    res.send({ message: "Password reset sucessfully" });
  } else {
    res.send({ message: "Invalid OTP" });
  }
});
