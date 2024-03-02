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


module.exports = {
  checkDatabaseQuery,
  createPaymentsTableQuery,
  createPaymentQuery,
};
