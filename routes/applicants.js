const express = require("express");
const path = require("path");
const { updateApplicantRegisterCounter } = require("../middlewares/usersMiddlewares");
const router = express.Router();
const multer = require("multer");
const { createApplicant } = require("../controllers/apllicantsController");

// multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "applications")); // Folder where Images Are saved
  },
  filename: (req, file, cb) => {
    // const imageId = req.header("imageId");
    const imageId = "abcd";
    cb(null, `${imageId}.pdf`); // file Name
  },
});
const storeProfilePic = multer({ storage });

// Public routes
router.route("/apply").post(updateApplicantRegisterCounter, createApplicant);

// Private routes

module.exports = router;
