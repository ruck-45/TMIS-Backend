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
  const { department, jobType, location, experience, start, end } = req.query;
  const limit_start = start ? parseInt(start, 10) : 0;
  const limit_end = end ? parseInt(end, 10) : 8;

  if (limit_start >= limit_end) {
    return res.status(400).json({ success: false, payload: { message: "Bad Request" } });
  }

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

  query += ` LIMIT ${limit_end} OFFSET ${limit_start}`;

  console.log("query: " + query);
  console.log("count-query: " + countQuery);

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
    payload: { jobs: fetchedJobs, message: "There are no active jobs available", total: totalNumberOfJobs },
  });
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
