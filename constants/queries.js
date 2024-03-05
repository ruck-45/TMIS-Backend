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


const findUserEmailQuery = `SELECT * FROM users WHERE email = ?`;


module.exports = {
  checkDatabaseQuery,
  createPaymentsTableQuery,
  createPaymentQuery,
  createJobsTableQuery,
  createJobsContentTableQuery,
  createUsersTableQuery,
  insertUserDetailsQuery,
  findUserEmailQuery,
};
