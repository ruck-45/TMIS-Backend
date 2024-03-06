const express = require("express");
const { updateApplicantRegisterCounter } = require("../middlewares/usersMiddlewares");
const router = express.Router();
const { createApplicant } = require("../controllers/apllicantsController")
// Public routes
router.route("/apply").post(updateApplicantRegisterCounter, createApplicant);

// Private routes


module.exports = router;
