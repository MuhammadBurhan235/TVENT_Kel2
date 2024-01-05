const express = require("express");
const { showSekre } = require("../controllers/UserController.js");

const router = express.Router();

router.get("/sekretaris", showSekre);

module.exports = router;
