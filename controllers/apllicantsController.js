const { executeQuery } = require("../utils/database");
const { createApplicantQuery, getApplicantsQuery, duplicateQuery } = require("../constants/queries");
const fs = require("fs");
const path = require("path");

const genApplicantid = (counter) => {
  // Timestamp component (YYYYMMDDHHMMSS)
  const currentDate = new Date();
  const timestampComponent = currentDate.toISOString().slice(0, 19).replace(/[-:T]/g, "");

  // Random component (5 digits)
  const randomComponent = Math.floor(Math.random() * 600000)
    .toString()
    .padStart(5, "0");

  // Counter Component - Resets every Day
  console.log("counter: " + counter);
  const counterComponent = counter.toString().padStart(5, "0");

  // UserId
  const userId = timestampComponent + randomComponent + counterComponent;

  return userId;
};
const createApplicant = async (req, res) => {
  const {
    full_name,
    email,
    contact,
    graduation_year,
    experience_years,
    current_employer,
    current_ctc,
    expected_ctc,
    notice_period,
    current_location,
    applicantCounter,
    id,
  } = req.body;

  if (
    full_name === undefined ||
    email === undefined ||
    contact === undefined ||
    graduation_year === undefined ||
    experience_years === undefined ||
    expected_ctc === undefined ||
    current_location === undefined ||
    applicantCounter === undefined ||
    id === undefined
  ) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }

  const duplicate = await executeQuery(duplicateQuery, [id, email]);

  if (duplicate.result[0].length > 0) {
    return res.status(406).json({ success: false, payload: { message: "You already applied for this Job" } });
  }
  console.log(duplicate.result[0].length);
  const applicantId = genApplicantid(applicantCounter);
  try {
    const createApplicant = await executeQuery(createApplicantQuery, [
      applicantId,
      id,
      full_name,
      email,
      contact,
      graduation_year,
      experience_years,
      current_employer,
      current_ctc,
      expected_ctc,
      notice_period,
      current_location,
    ]);

    if (!createApplicant.success) {
      return res.status(500).json({ success: false, payload: { message: "Error occurred while creating applicant." } });
    }

    const defaultResumeFilename = "default.pdf";
    const applicantResumeFilename = `${applicantId}.pdf`;

    const defaultResumePath = path.join(__dirname, "../public", "applicantResumes", defaultResumeFilename);
    const applicantResumePath = path.join(__dirname, "../public", "applicantResumes", applicantResumeFilename);

    // Read the contents of the default image file
    const defaultResumeBuffer = fs.readFileSync(defaultResumePath);
    // Write the contents to the user's folder with the user-specific filename
    fs.writeFileSync(applicantResumePath, defaultResumeBuffer);
    resumeInitMessage = {
      resumeInitializationSuccess: true,
      resumePayload: { resumeMessage: "Resume Uploaded Successfully." },
    };
    return res.status(201).json({
      success: true,
      payload: { message: "Applicant Created Successfully.", ...resumeInitMessage, applicantId },
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ success: false, payload: { message: "Internal Server error." } });
  }
};

const createApplicantResume = async (req, res) => {
  // Return If No File Uploaded
  if (!req.file) {
    return res.status(400).json({ success: false, payload: { message: "Resume Not Found" } });
  }

  return res.status(200).json({ success: true, payload: { message: "Resume Pdf Uploaded Successfully" } });
};

const getApplicants = async (req, res) => {
  const { jobId, start, end } = req.body;
  const limit_start = start ? parseInt(start, 10) : 0;
  const limit_end = end ? parseInt(end, 10) : 8;

  if (limit_start >= limit_end) {
    return res.status(400).json({ success: false, payload: { message: "Bad Request" } });
  }

  if (jobId === undefined) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }
  try {
    const applicantsQuery = await executeQuery(getApplicantsQuery, [jobId, limit_end, limit_start]);
    if (!applicantsQuery.success) {
      return res.status(401).json({ success: false, payload: { message: "Error While fetching applicants." } });
    }
    return res
      .status(201)
      .json({
        success: false,
        payload: { applicants: applicantsQuery.result[0], message: "Applicants fetched successfully." },
      });
  } catch (error) {}
};

module.exports = {
  createApplicant,
  createApplicantResume,
  getApplicants,
};
