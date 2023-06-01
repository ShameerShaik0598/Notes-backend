//import express
const express = require("express");

//create router
const notesApp = express.Router();

//middleware
const { verifyUserToken } = require("../midlleware/verifyUserToken");

//import controllers
const {
  addNotes,
  getAllNotes,
  updateNotes,
  deleteNote
} = require("../controllers/notes.controller");

//Routes

//get all notes
notesApp.get("/get-all-notes", verifyUserToken, getAllNotes);

//add notes
notesApp.post("/add-notes", verifyUserToken, addNotes);

//update notes
notesApp.put("/update-notes", verifyUserToken, updateNotes);

//delete notes
notesApp.delete("/delete-notes", verifyUserToken, deleteNote);

module.exports = notesApp;
