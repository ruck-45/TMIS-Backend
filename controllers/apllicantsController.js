const { executeQuery } = require("../utils/database");
const { createApplicantQuery } = require("../constants/queries");

const genApplicantid = (counter) => {
  // Timestamp component (YYYYMMDDHHMMSS)
  const currentDate = new Date();
  const timestampComponent = currentDate.toISOString().slice(0, 19).replace(/[-:T]/g, "");

  // Random component (5 digits)
  const randomComponent = Math.floor(Math.random() * 600000)
    .toString()
    .padStart(5, "0");

  // Counter Component - Resets every Day
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
    return res.status(201).json({ success: true, payload: { message: "Applicant Created Successfully." } });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ success: false, payload: { message: "Internal Server error." } });
  }
};

module.exports = {
  createApplicant,
};
