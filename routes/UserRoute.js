const express = require("express");
const { showSekre, showSekreJabatan, } = require("../controllers/UserController.js");

const router = express.Router();

// router.get("/sekretaris/:eventsekreid", eventSekre);
router.get("/sekretaris", showSekre);
router.post("/verifikasi/:userregisID", showSekreJabatan);

module.exports = router;
