const pool = require("../config/databaseConfig");
const { checkDatabaseQuery, createPaymentsTableQuery, createPlansTableQuery } = require("../constants/queries");

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

const createPlansTable = async () => {
  const res = await executeQuery(createPlansTableQuery);
  if (res.success) {
    console.log(`plans Table Created Successfully`);
  } else {
    throw Error(res.result);
  }
};


module.exports = {
  executeQuery,
  testConnection,
  createPaymentsTable,
  createPlansTable,
};
