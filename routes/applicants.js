const express = require("express");
const { updateApplicantRegisterCounter, uploadResumeFile } = require("../middlewares/usersMiddlewares");
const router = express.Router();
const { createApplicant, createApplicantResume, getApplicants } = require("../controllers/apllicantsController");
const path = require("path");
const multer = require("multer");

router.use("/applicantResumes", express.static("./public/applicantResumes"));

// multer storage setup

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "applicantResumes")); // Folder where Images Are saved
  },
  filename: (req, file, cb) => {
    const applicantId = req.header("applicantId");
    cb(null, `${applicantId}.pdf`); // file Name
  },
});
const storeResume = multer({ storage });



// Public routes
router.route("/apply").post( updateApplicantRegisterCounter, createApplicant);

router.route("/uploadResume").post(storeResume.single("resume"), createApplicantResume);

router.route("/getApplicants").get(getApplicants);
// Private routes

module.exports = router;
