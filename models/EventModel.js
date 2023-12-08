const { Sequelize } = require("sequelize");
const tvdb = require("../config/Database.js");

const { DataTypes } = Sequelize;

const Event = tvdb.define(
  "events",
  {
    email: DataTypes.STRING,
    nama_event: DataTypes.STRING,
    deskripsi_event: DataTypes.STRING,
    penyelenggara_event: DataTypes.STRING,
    klasifikasi_divisi: DataTypes.STRING,
    benefit_event: DataTypes.STRING,
    kepanitiaan_mulai: DataTypes.DATE,
    kepanitiaan_selesai: DataTypes.DATE,
    event_mulai: DataTypes.DATE,
    event_selesai: DataTypes.DATE,
    poster_event: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

module.exports = Event;

(async () => {
  await tvdb.sync();
})();
