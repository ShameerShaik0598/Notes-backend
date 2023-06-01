//import datatypes from sequelize
const { DataTypes } = require("sequelize");

//import sequelize from db
const sequelize = require("../db.config");

//create a model for notes
exports.Notes = sequelize.define(
  "notes",
  {
    note_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    note: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  }
);
