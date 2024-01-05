const express = require("express");
const {
  showSekre,
  profileUser,
  verifPanitia,
  gallery,

  getMainPage,
} = require("../controllers/UserController.js");

const router = express.Router();

// router.get("/sekretaris/:eventsekreid", eventSekre);
router.get("/sekretaris", showSekre);
router.get("/profile-user", profileUser);
router.post("/verifikasi/:userregisID", verifPanitia);
router.get("/", getMainPage);
router.get("/gallery", gallery);

module.exports = router;
