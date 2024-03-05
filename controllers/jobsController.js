const { executeQuery } = require("../utils/database");

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

const getActiveJobs = async (req, res) => {
  const { department, job_type, location, experience } = req.query;
  let query = "SELECT * FROM Jobs WHERE 1=1";

  // Add filters based on query parameters
  if (department) query += ` AND department = '${department}'`;
  if (job_type) query += ` AND job_type = '${job_type}'`;
  if (location) query += ` AND location = '${location}'`;
  if (experience) query += ` AND experience_level = '${experience}'`;

  console.log("query: " + query);
  // Execute the query
  const getJobsQuery = await executeQuery(query);
  console.log(getJobsQuery);
  if (!getJobsQuery.success) {
    return res.status(404).json({ success: false, payload: { message: "Error while fetching jobs." } });
  }
  const fetchedJobs = getJobsQuery.result[0];
  console.log(fetchedJobs.length);
  if (fetchedJobs.length > 0) {
    return res
      .status(201)
      .json({ success: true, payload: { jobs: fetchedJobs, message: "Jobs fetched successfully." } });
  }
  return res
    .status(201)
    .json({ success: false, payload: { jobs: fetchedJobs, message: "There are no active jobs available" } });
};

const getJobDetails = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  genJobid,
  getActiveJobs,
  getJobDetails,
};
