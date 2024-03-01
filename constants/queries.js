const checkDatabaseQuery = `SHOW TABLES`;

const createPaymentsTableQuery = `CREATE TABLE IF NOT EXISTS payments (
                                    receipt_id VARCHAR(30) PRIMARY KEY,
                                    name VARCHAR(50) NOT NULL,
                                    email VARCHAR(64) NOT NULL,
                                    company_name TEXT NOT NULL,
                                    phone VARCHAR(100) UNIQUE NOT NULL,
                                    address TEXT  NOT NULL,
                                    currency VARCHAR(5) UNIQUE NOT NULL,
                                    total_amount DECIMAL(10, 2) NOT NULL,
                                    payments_date DATETIME DEFAULT CURRENT_TIMESTAMP
                                )`;

const createPlansTableQuery = `CREATE TABLE IF NOT EXISTS plans (
                                receipt_id VARCHAR(30) PRIMARY KEY,
                                name VARCHAR(50) NOT NULL,
                                company_name TEXT NOT NULL,
                                plan VARCHAR(50) NOT NULL,
                                service VARCHAR(50) NOT NULL,
                                amount DECIMAL(10, 2) NOT NULL,
                                date_created DATETIME DEFAULT CURRENT_TIMESTAMP
                              )`;

module.exports = {
  checkDatabaseQuery,
  createPaymentsTableQuery,
  createPlansTableQuery,
};
