//import sequelize
const { Sequelize } = require("sequelize");

//import environmental variables
require("dotenv").config(); //to change env variables to process.env object

//import connection with database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",
    logging: console.log,
  }
);

module.exports = sequelize;
