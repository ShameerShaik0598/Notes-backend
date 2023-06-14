//import expressAsynchandler
const expressAsyncHandler = require("express-async-handler");

//import dotenv
require("dotenv").config();

//import jwt
const jwt = require("jsonwebtoken");

//import models
const { User } = require("../database/models/user.model");
const { Notes } = require("../database/models/notes.model");

//Controllers

// Get all notes of the user
exports.getAllNotes = expressAsyncHandler(async (req, res) => {
  const userId = req.userId;

  // Get all notes
  const allNotes = await Notes.findAll({
    where: {
      status: true,
      user_id: userId,
    },
  });

  // // Get the count of notes created in one day
  // const countOfNotesInOneDay = getCountOfNotesInOneDay(userId);

  res.send({
    message: "success",
    payload: allNotes,
  });
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
    where: { note_id: req.params.note_id },
  });
  res.status(200).send({ message: "notes updated" });
});

//delete notes
exports.deleteNote = expressAsyncHandler(async (req, res) => {
  let deleteNote = await Notes.update(req.body, {
    where: { note_id: req.params.note_id },
  });
  res.status(200).send({ message: "notes deleted succesfully" });
});

////////////////////////////////////

const Queue = require("bull");
const redis = require("redis");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

// Create a Redis client
const redisClient = redis.createClient({
  host: "localhost", // Redis server host
  port: 6379, // Redis server port
});
console.log("Redis client connected");

// Create a new Bull queue instance
const emailQueue = new Queue("email", {
  redis: {
    client: redisClient,
  },
});
console.log("Email queue created");

// Function to send the email
const sendEmail = async (email, totalNotesCount) => {
  try {
    // Configure email provider and authentication
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE_PROVIDER,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Today's Notes Count",
      text: `Total notes created today: ${totalNotesCount}\nClick here to see all notes: http://localhost:3000/get-all-notes`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error occurred while sending the email:", error);
  }
};

// Function to get the count of total notes created by the user in one day
const getCountOfNotesAndScheduleEmail = async (email, targetTime) => {
  try {
    // Retrieve the user_id based on the email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`User with email ${email} not found.`);
      return;
    }

    // Extract the user_id from the user object
    const user_id = user.user_id;

    // Get the current date in UTC
    const currentDate = new Date();
    const currentUTCDate = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate()
      )
    );

    // Set the start and end time of the day in UTC
    const startTime = new Date(
      currentUTCDate.getUTCFullYear(),
      currentUTCDate.getUTCMonth(),
      currentUTCDate.getUTCDate(),
      0,
      0,
      0
    );
    const endTime = new Date(
      currentUTCDate.getUTCFullYear(),
      currentUTCDate.getUTCMonth(),
      currentUTCDate.getUTCDate(),
      23,
      59,
      59
    );

    // Find the count of notes created by the user within the specified time range
    const totalNotesCount = await Notes.count({
      where: {
        user_id,
        createdAt: {
          [Op.between]: [startTime.toISOString(), endTime.toISOString()],
        },
      },
    });
    console.log("user id for email", user_id);
    console.log("notes mottam", totalNotesCount);

    // Schedule email sending at the target time
    const jobData = {
      email,
      totalNotesCount,
    };

    console.log("job data bro", jobData);

    // Calculate the delay in milliseconds
    const delay = targetTime.getTime() - Date.now();
    console.log("delay bro", delay);

    // Schedule the email sending task
    const job = await emailQueue.add(jobData, { delay });
    // console.log("job ", job);

    console.log("Email job scheduled:", job.id);
  } catch (error) {
    console.error("Error occurred while getting the count of notes:", error);
  }
};

// Consumer to process the email sending task
emailQueue.process(async (job) => {
  const { email, totalNotesCount } = job.data;
  await sendEmail(email, totalNotesCount);
});

// Set up error event listener for the email queue
emailQueue.on("error", (error) => {
  console.log("Email queue error:", error);
});

// Example usage
const targetTime = new Date();
targetTime.setUTCHours(15);
targetTime.setUTCMinutes(44);
targetTime.setUTCSeconds(0);

console.log("tarrrgeeet time", targetTime);

// Check if the target time has already passed
const currentTime = new Date();
console.log("cuirrrreent time", currentTime);
if (targetTime < currentTime) {
  // If the target time has already passed today, schedule for tomorrow
  targetTime.setUTCDate(targetTime.getUTCDate() + 1);
}

// Define the email
const email = "nreply9090@gmail.com";

// Schedule the email sending task
getCountOfNotesAndScheduleEmail(email, targetTime);
