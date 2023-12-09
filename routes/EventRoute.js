const express = require("express");
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/EventController.js");

const router = express.Router();

router.get("/events", getEvents);
router.get("/events/:id", getEventById);
router.post("/event", createEvent);
router.patch("/event/:id", updateEvent);
router.delete("/event/:id", deleteEvent);

module.exports = router;
