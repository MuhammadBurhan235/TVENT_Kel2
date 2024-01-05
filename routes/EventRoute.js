const express = require("express");
const {
  createEvent,
  getBuatEvent,
  listEvents,
  profileEvent,
  getJoinEvent,
  joinEvent,
  myEvent,
} = require("../controllers/EventController.js");

const router = express.Router();

router.get("/list-event", listEvents);
router.get("/profile-event/:eventId", profileEvent);
router.get("/my-event", myEvent);

router.post("/buat-event", createEvent);
router.get("/buat-event", getBuatEvent);
router.post("/:eventId/join-event/:divisi", joinEvent);
router.get("/:eventId/join-event/:divisi", getJoinEvent);

module.exports = router;
