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
  deleteNote,
  // getCountOfNotesAndScheduleEmail,
} = require("../controllers/notes.controller");

//Routes

//get all notes
notesApp.get("/get-all-notes", verifyUserToken, getAllNotes);

//add notes
notesApp.post("/add-notes", verifyUserToken, addNotes);

//update notes
notesApp.put("/update-notes/:note_id", verifyUserToken, updateNotes);

//count total notes in one day
// notesApp.get(
//   "/total-notes/:user_id",
//   verifyUserToken,
//   getCountOfNotesAndScheduleEmail
// );

//delete notes
notesApp.put("/delete-notes/:note_id", verifyUserToken, deleteNote);

module.exports = notesApp;
