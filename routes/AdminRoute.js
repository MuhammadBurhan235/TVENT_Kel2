const express = require("express");
const {
  verifEvent,

  getAdminPage,
} = require("../controllers/AdminController.js");

const router = express.Router();

router.post("/verifikasi/:userregisID", verifEvent);
router.get("/adminpage", getAdminPage);

module.exports = router;
