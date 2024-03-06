const express = require("express");
const passport = require("passport");
const { getActiveJobs, getJobDetails } = require("../controllers/jobsController")

const router = express.Router();


router.get("/activeJobs", getActiveJobs);
router.get("/:id", getJobDetails);


module.exports = router;