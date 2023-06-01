//import express
const express = require("express");

//calling express function
const app = express();

//import dotenv
require("dotenv").config();

//listen to the port
app.listen(process.env.PORT, () => console.log("Port is on 1500"));

//import database connection
const sequelize = require("./database/db.config");

//test the database connection
sequelize
  .authenticate()
  .then(() => console.log("Connection Successfull"))
  .catch((err) => console.log("Error has occured at : ", err));

//create tables for models in the database
const { User } = require("./database/models/user.model");
const { Notes } = require("./database/models/notes.model");
User.sync();
Notes.sync();

//body parser
app.use(express.json());

//Import userApp Api
const userApp = require("./routes/user.route");

//Import notesApp Api
const notesApp = require("./routes/notes.route");

//Routing

//Routing for user Api
app.use("/user", userApp);

//Routing for notes api
app.use("/notes", notesApp);

//invalid path
app.use("*", (req, res) => {
  res.send({ message: "invalid path" });
});

//Error handling middleware
app.use((err, req, res, next) => {
  res.send({ message: "Error ocuured at:", Error: err.message });
});
