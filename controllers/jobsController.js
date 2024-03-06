const { executeQuery } = require("../utils/database");
const {
  getJobDetailsByIdQuery,
  insertJobQuery,
  insertJobContentQuery,
  deleteContentQuery,
  deleteJobQuery,
  updateJobContentQuery,
  updateJobQuery,
} = require("../constants/queries");

const genJobid = (counter) => {
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

const createJob = async (req, res) => {
  const {
    title,
    department,
    job_type,
    experience_level,
    location,
    skills,
    description,
    role,
    role_category,
    industry,
    required_education,
    required_profile,
    jobCounter,
  } = req.body;

  try {
    const job_id = genJobid(jobCounter);
    const query1 = await executeQuery(insertJobQuery, [
      job_id,
      title,
      department,
      job_type,
      experience_level,
      location,
      JSON.stringify(skills),
    ]);

    if (!query1.success) {
      return res.status(404).json({ success: false, payload: { message: "Error while creating job." } });
    }

    const query2 = await executeQuery(insertJobContentQuery, [
      job_id,
      description,
      role,
      role_category,
      industry,
      JSON.stringify(required_education),
      JSON.stringify(required_profile),
    ]);
    if (!query2.success) {
      return res.status(404).json({ success: false, payload: { message: "Error while creating jobs content" } });
    }
    return res.status(201).json({ success: true, payload: { message: "Job Created Successfully." } });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteJob = async (req, res) => {
  const { id: job_id } = req.params;
  if (job_id === undefined) {
    return res.status(404).json({ success: false, payload: { message: "Job Id must be provided." } });
  }
  try {
    const deleteContentResult = await executeQuery(deleteContentQuery, [job_id]);
    if (!deleteContentResult.success) {
      return res.status(404).json({ success: false, payload: { message: "Error while deleting job content." } });
    }

    const deleteJobResult = await executeQuery(deleteJobQuery, [job_id]);
    if (!deleteJobResult.success) {
      return res.status(404).json({ success: false, payload: { message: "Error while deleting job." } });
    }
    return res.status(200).json({ success: true, payload: { message: "Job deleted successfully." } });
  } catch (error) {
    return res.status(500).json({ success: false, payload: { message: "Internal Server error." } });
  }
};

const updateJob = async (req, res) => {
  const job_id = req.params.id;
  if (job_id === undefined) {
    return res.status(404).json({ success: false, payload: { message: "Job Id must be provided." } });
  }

  const {
    title,
    department,
    job_type,
    experience_level,
    location,
    skills,
    description,
    role,
    role_category,
    industry,
    required_education,
    required_profile,
  } = req.body;

  try {
    const updateJobResult = await executeQuery(updateJobQuery, [
      title,
      department,
      job_type,
      experience_level,
      location,
      JSON.stringify(skills),
      job_id,
    ]);

    if (!updateJobResult.success) {
      return res.status(404).json({ success: false, payload: { message: "Error while updating job." } });
    }

    const updateJobContentResult = await executeQuery(updateJobContentQuery, [
      description,
      role,
      role_category,
      industry,
      JSON.stringify(required_education),
      JSON.stringify(required_profile),
      job_id,
    ]);

    if (!updateJobContentResult.success) {
      return res.status(404).json({ success: false, payload: { message: "Error while updating job content." } });
    }

    return res.status(200).json({ success: true, payload: { message: "Job updated successfully." } });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ success: false, payload: { message: "Internal Server Error." } });
  }
};

const getActiveJobs = async (req, res) => {
  const { department, jobType, location, experience, start, space } = req.query;
  const offset = start ? parseInt(start, 10) : 0;
  const limit = space ? parseInt(space, 10) : 8;

  let query = "SELECT * FROM Jobs WHERE 1=1";
  let countQuery = "SELECT COUNT(*) AS totalJobs FROM Jobs WHERE 1=1";
  // Add filters based on query parameters
  if (department && department !== "All") {
    query += ` AND department = '${department}'`;
    countQuery += ` AND department = '${department}'`;
  }
  if (jobType && jobType !== "All") {
    query += ` AND job_type = '${jobType}'`;
    countQuery += ` AND job_type = '${jobType}'`;
  }
  if (location && location !== "All") {
    query += ` AND location = '${location}'`;
    countQuery += ` AND location = '${location}'`;
  }
  if (experience && experience !== "All") {
    query += ` AND experience_level = '${experience}'`;
    countQuery += ` AND experience_level = '${experience}'`;
  }

  query += ` ORDER BY creation_date DESC LIMIT ${limit} OFFSET ${offset}`;

  // Execute the query
  const getJobsQuery = await executeQuery(query);
  if (!getJobsQuery.success) {
    return res.status(404).json({ success: false, payload: { message: "Error while fetching jobs." } });
  }
  const fetchedJobs = getJobsQuery.result[0];

  const totalJobs = await executeQuery(countQuery);
  if (!totalJobs.success) {
    return res.status(404).json({
      success: totalJobs.success,
      payload: { message: "Not Found", result: totalJobs.result },
    });
  }
  const totalNumberOfJobs = totalJobs.result[0][0].totalJobs;

  return res.status(200).json({
    success: true,
    payload: { jobs: fetchedJobs, message: "Job Search Successful", total: totalNumberOfJobs },
  });
};

const getJobDetailsById = async (req, res) => {
  const { id: jobId } = req.params;

  if (jobId === undefined) {
    return res.status(404).json({ success: false, payload: { message: "Please Provide Job Id" } });
  }

  try {
    const getJobDetailsQuery = await executeQuery(getJobDetailsByIdQuery, jobId);
    if (!getJobDetailsQuery.success) {
      return res.status(404).json({ success: false, payload: { message: "Error while fetching job details" } });
    }
    const jobDetails = getJobDetailsQuery.result[0];
    return res
      .status(201)
      .json({ success: true, payload: { jobDetails, message: "Job details fetched successfully." } });
  } catch (error) {
    return res.status(500).json({ success: false, payload: { message: "Internal Server Error" } });
  }
};

module.exports = {
  genJobid,
  getActiveJobs,
  getJobDetailsById,
  createJob,
  deleteJob,
  updateJob,
};
