require("dotenv").config();
const express = require("express");
const { createOrder, paymentSuccess } = require("../controllers/paymentsController");

const router = express.Router();


// routes
router.route("/orders").post(createOrder);
router.route("/verify").post(paymentSuccess);

module.exports = router;
