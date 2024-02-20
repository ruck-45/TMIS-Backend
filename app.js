require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const paymentRouter = require("./routes/payment"); // Assuming your route file is named payment.js
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use("/payment", paymentRouter); // Mount the paymentRouter under /payment

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
