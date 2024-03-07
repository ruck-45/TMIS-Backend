const checkDatabaseQuery = `SHOW TABLES`;

const createPaymentsTableQuery = `CREATE TABLE IF NOT EXISTS payments (
                                    payment_id VARCHAR(50) UNIQUE PRIMARY KEY,
                                    order_id VARCHAR(50) UNIQUE NOT NULL,
                                    name VARCHAR(50) NOT NULL,
                                    email VARCHAR(64) NOT NULL,
                                    company_name TEXT NOT NULL,
                                    phone VARCHAR(100) NOT NULL,
                                    address TEXT  NOT NULL,
                                    service_1 VARCHAR(30),
                                    plan_1 VARCHAR(30),
                                    service_2 VARCHAR(30),
                                    plan_2 VARCHAR(30),
                                    service_3 VARCHAR(30),
                                    plan_3 VARCHAR(30),
                                    service_4 VARCHAR(30),
                                    plan_4 VARCHAR(30),
                                    currency VARCHAR(5) NOT NULL,
                                    total_amount DECIMAL(10, 2) NOT NULL,
                                    payments_date DATETIME DEFAULT CURRENT_TIMESTAMP
                                )`;

const createPaymentQuery = `
                            INSERT INTO payments (
                                payment_id,
                                order_id,
                                name,
                                email,
                                company_name,
                                phone,
                                address,
                                service_1,
                                plan_1,
                                service_2,
                                plan_2,
                                service_3,
                                plan_3,
                                service_4,
                                plan_4,
                                currency,
                                total_amount
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const createJobsTableQuery = `CREATE TABLE IF NOT EXISTS  Jobs (
                                job_id VARCHAR(255) PRIMARY KEY,
                                title VARCHAR(255) NOT NULL,
                                department VARCHAR(255) NOT NULL,
                                job_type VARCHAR(50) NOT NULL,
                                experience_level VARCHAR(50) NOT NULL,
                                location VARCHAR(255) NOT NULL,
                                skills JSON,
                                creation_date DATETIME DEFAULT CURRENT_TIMESTAMP
                              )`;

const createJobsContentTableQuery = `CREATE TABLE IF NOT EXISTS Jobs_content (
                                        job_id VARCHAR(255),
                                        description TEXT NOT NULL,
                                        role VARCHAR(255) NOT NULL,
                                        role_category VARCHAR(255) NOT NULL,
                                        industry VARCHAR(255) NOT NULL,
                                        required_education JSON,
                                        required_profile JSON,
                                        FOREIGN KEY (job_id) REFERENCES Jobs(job_id)
                                    )`;

const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(30) PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password_salt VARCHAR(64) NOT NULL,
        password_hash VARCHAR(128) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

const insertUserDetailsQuery = `
  INSERT INTO users (user_id, username, password_salt, password_hash, email)
  VALUES (?, ?, ?, ?, ?)
`;

const findUserByIdQuery = `SELECT * FROM users WHERE user_id = ?`;

const getJobDetailsByIdQuery = `SELECT j.job_id, j.title, j.department, j.job_type, j.experience_level, j.location, j.skills, j.creation_date, jc.description, jc.role, jc.role_category, jc.industry, jc.required_education, jc.required_profile
                                FROM Jobs j
                                JOIN Jobs_content jc ON j.job_id = jc.job_id
                                WHERE j.job_id = ?`;

const insertJobQuery = `INSERT INTO Jobs (job_id, title, department, job_type, experience_level, location, skills) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)`;

const insertJobContentQuery = `INSERT INTO Jobs_content (job_id, description, role, role_category, industry, required_education, required_profile) 
                                VALUES (?, ?, ?, ?, ?, ?, ?)`;

const deleteContentQuery = `DELETE FROM Jobs_content WHERE job_id = ?`;
const deleteJobQuery = `DELETE FROM Jobs WHERE job_id = ?`;
const updateJobQuery = `UPDATE Jobs SET title=?, department=?, job_type=?, experience_level=?, location=?, skills=? WHERE job_id=?`;
const updateJobContentQuery = `UPDATE Jobs_content SET description=?, role=?, role_category=?, industry=?, required_education=?, required_profile=? WHERE job_id=?`;

const createApplicantstableQuery = `CREATE TABLE IF NOT EXISTS applicant (
                                        applicant_id VARCHAR(255) PRIMARY KEY,
                                        job_id VARCHAR(255) NOT NULL,
                                        full_name VARCHAR(255) NOT NULL,
                                        email VARCHAR(255) NOT NULL,
                                        contact VARCHAR(15) NOT NULL,
                                        graduation_year DATE NOT NULL,
                                        experience_years INT,
                                        current_employer VARCHAR(255),
                                        current_ctc FLOAT,
                                        expected_ctc FLOAT NOT NULL,
                                        notice_period INT,
                                        current_location VARCHAR(255) NOT NULL,
                                        FOREIGN KEY (job_id) REFERENCES Jobs(job_id)
                                    )`;

const createApplicantQuery = `INSERT INTO applicant (applicant_id, job_id, full_name, email, contact, graduation_year, experience_years, current_employer, current_ctc, expected_ctc, notice_period, current_location) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const duplicateQuery = `SELECT * FROM applicant WHERE job_id = ? AND email = ?`;                            

const findUserEmailQuery = `SELECT * FROM users WHERE email = ?`;


const getApplicantsQuery = `SELECT * FROM applicant WHERE job_id = ? LIMIT ? OFFSET ?`;

module.exports = {
  checkDatabaseQuery,
  createPaymentsTableQuery,
  createPaymentQuery,
  createJobsTableQuery,
  createJobsContentTableQuery,
  createUsersTableQuery,
  insertUserDetailsQuery,
  findUserByIdQuery,
  getJobDetailsByIdQuery,
  insertJobQuery,
  insertJobContentQuery,
  deleteContentQuery,
  deleteJobQuery,
  updateJobQuery,
  updateJobContentQuery,
  createApplicantstableQuery,
  createApplicantQuery,
  findUserEmailQuery,
  duplicateQuery
};
