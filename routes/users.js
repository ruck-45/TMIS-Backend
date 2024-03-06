// Dependencies
const express = require("express");
const passport = require("passport");

// Local Files
const {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/usersController");
const { updateRegisterCounter } = require("../middlewares/usersMiddlewares");
const router = express.Router();

// routes
router.route("/signup").post(updateRegisterCounter, createUser);
router.route("/login").post(loginUser);

module.exports = router;
