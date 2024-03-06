const pool = require("../config/databaseConfig");
const { checkDatabaseQuery, createPaymentsTableQuery, createJobsContentTableQuery, createJobsTableQuery, createUsersTableQuery, createApplicantstableQuery } = require("../constants/queries");

const executeQuery = async (query, values = []) => {
  let success;
  let result;

  try {
    result = await pool.query(query, values);
    success = true;
  } catch (err) {
    result = err;
    success = false;
  }

  return {
    result,
    success,
  };
};

const testConnection = async () => {
  const res = await executeQuery(checkDatabaseQuery);
  if (res.success) {
    console.log(`Database Connection Successful. Test Result : ${JSON.stringify(res.result[0])}`);
  } else {
    throw Error(JSON.stringify(res.result));
  }
};

const createPaymentsTable = async () => {
  const res = await executeQuery(createPaymentsTableQuery);
  if (res.success) {
    console.log(`Payments Table Created Successfully`);
  } else {
    throw Error(res.result);
  }
};

const createJobsContentTable = async () => {
  const res = await executeQuery(createJobsContentTableQuery);
  if (res.success) {
    console.log(`Jobs Content Table Created Successfully`);
  } else {
    throw Error(res.result);
  }
};

const createJobsTable = async () => {
  const res = await executeQuery(createJobsTableQuery);
  if (res.success) {
    console.log(`Jobs Table Created Successfully`);
  } else {
    throw Error(res.result);
  }
};

const createUsersTable = async () => {
  const res = await executeQuery(createUsersTableQuery);
  if (res.success) {
    console.log(`Users Table Created Successfully`);
  } else {
    throw Error(res.result);
  }
};

const createApplicantstable = async () => {
  const res = await executeQuery(createApplicantstableQuery);
  if (res.success) {
    console.log(`Applicants Table Created Successfully`);
  } else {
    throw Error(res.result);
  }
};

module.exports = {
  executeQuery,
  testConnection,
  createPaymentsTable,
  createJobsContentTable,
  createJobsTable,
  createUsersTable,
  createApplicantstable,
};
