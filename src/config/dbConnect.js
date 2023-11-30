// config/config.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Set the database URL for different environments (development, production, etc.)
const dbUrl = process.env.DATABASE_URL;
const DIALECT = process.env.DIALECT;

const sequelize = new Sequelize(dbUrl, {
  dialect: DIALECT,
  logging: false, // Set to true to see SQL queries in the console
});

module.exports = sequelize;
