const { Sequelize } = require("sequelize");
const tvdb = require("../config/Database.js");

const { DataTypes } = Sequelize;

const User = tvdb.define(
  "users",
  {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    nama_depan: DataTypes.STRING,
    nama_belakang: DataTypes.STRING,
    phone: DataTypes.DATE,
    gender: DataTypes.STRING,
    nim: DataTypes.STRING,
    fakultas: DataTypes.STRING,
    program_studi: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

module.exports = User;

(async () => {
  await tvdb.sync();
})();
