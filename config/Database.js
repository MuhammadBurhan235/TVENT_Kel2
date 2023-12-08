const { Sequelize } = require("sequelize");

const tvdb = new Sequelize("tvent1_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = tvdb;
