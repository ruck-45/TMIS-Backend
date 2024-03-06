// Dependencies
require("dotenv").config();
const passport = require("passport");
const cors = require("cors");
const express = require("express");
const { testConnection, createPaymentsTable, createJobsContentTable, createJobsTable, createUsersTable, createApplicantstable } = require("./utils/database");
require("./config/passportConfig")(passport);


// Local Files
const paymentRouter = require("./routes/payment");
const usersRouter = require("./routes/users");
const jobsRouter = require("./routes/jobs")
const applicantRouter = require("./routes/applicants")
const port = process.env.PORT || 5000;
const app = express();

// Essential Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(passport.initialize());
app.use(cors());

// Routes
app.use("/api/payment", paymentRouter);
app.use("/api/users", usersRouter);
app.use("/api/careers", jobsRouter);
app.use("/api/applicant", applicantRouter);
// Database Connection and Configuration
testConnection();
createPaymentsTable();
createJobsContentTable();
createJobsTable();
createUsersTable();
createApplicantstable();


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
