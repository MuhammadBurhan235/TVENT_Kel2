const express = require("express");
const {
  createEvent,
  listEvents,
} = require("../controllers/EventController.js");

const router = express.Router();

router.post("/buat-event", createEvent);

router.get("/list-event", listEvents);
router.get("/buat-event", getBuatEvent);


module.exports = router;
