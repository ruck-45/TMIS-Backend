const express = require("express");
const passport = require("passport");
const { getActiveJobs, getJobDetailsById, createJob, deleteJob, updateJob } = require("../controllers/jobsController");
const { updateJobRegisterCounter} = require("../middlewares/usersMiddlewares")
const router = express.Router();


// Public routes
router.get("/activeJobs", getActiveJobs);
router.get("/:id", getJobDetailsById);

// Private routes
router.route("/createjob").post(passport.authenticate("jwt", { session: false }),updateJobRegisterCounter, createJob);
router.route("/deleteJob/:id").delete(passport.authenticate("jwt", { session: false }), deleteJob);
router.route("/updateJob/:id").put(passport.authenticate("jwt", { session: false}), updateJob);

module.exports = router;
