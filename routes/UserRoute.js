const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/UserController.js");
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/EventController.js");

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/events", getEvents);
router.get("/events/:id", getEventById);
router.post("/event", createEvent);
router.patch("/event/:id", updateEvent);
router.delete("/event/:id", deleteEvent);

module.exports = router;
