//import expressAsynchandler
const expressAsyncHandler = require("express-async-handler");

//import dotenv
require("dotenv").config();

//import jwt
const jwt = require("jsonwebtoken");

//import models
const { User } = require("../database/models/user.model");
const { Notes } = require("../database/models/notes.model");

//Associations
// User.Notes = User.hasMany(Notes, { foreignKey: "user_id" });
// Notes.sync({ alter: true });

//Controllers

//Get all notes of the user
exports.getAllNotes = expressAsyncHandler(async (req, res) => {
  let allNotes = await Notes.findAll({
    where: {
      status: true,
      user_id: req.userId,
    },
  });
  res.send({ message: "Notes", payload: allNotes });
});

//Add Notes
exports.addNotes = expressAsyncHandler(async (req, res) => {
  req.body.user_id = req.userId;
  let note = await Notes.create(req.body);

  res.status(200).send({ message: "Notes Added Successfully", payload: note });
});

//update notes
exports.updateNotes = expressAsyncHandler(async (req, res) => {
  let updatedNote = await Notes.update(req.body, {
    where: { note_id: req.body.note_id },
  });
  res.send({ message: "notes updated" });
});

//delete notes
exports.deleteNote = expressAsyncHandler(async (req, res) => {
  let deleteNote = await Notes.update(req.body, {
    where: { note_id: req.body.note_id },
  });
  res.send({ message: "notes deleted succesfully" });
});
