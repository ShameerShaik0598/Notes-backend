//import datatypes from the sequelize
const { DataTypes } = require("sequelize");
console.log("hiiiiiiiii");
//import bcrypt
const bcryptjs = require("bcryptjs");

//import sequelize from the db.config
const sequelize = require("../db.config");

//create a model for user
exports.User = sequelize.define(
  "user",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
  }
);


