// Dependencies
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { testConnection, createPaymentsTable, createPlansTable } = require("./utils/database");

// Local Files
const paymentRouter = require("./routes/payment");

const port = process.env.PORT || 5000;
const app = express();

// Essential Middlewares
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cors());

// Routes
app.use("/api/payment", paymentRouter);

// Database Connection and Configuration
testConnection();
createPaymentsTable();
createPlansTable();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
