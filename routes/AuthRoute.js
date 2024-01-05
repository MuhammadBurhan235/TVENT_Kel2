const express = require("express");
const {
  logOut,

  logIn,
  getLogIn,
  signUp,
  getSignUp,
  notLoggedInMiddleware,
} = require("../controllers/AuthController.js");

const router = express.Router();

router.post("/logout", logOut);

router.post("/login", logIn);
router.get("/login", getLogIn);
router.post("/signup", notLoggedInMiddleware, signUp);
router.get("/signup", notLoggedInMiddleware, getSignUp);

module.exports = router;
