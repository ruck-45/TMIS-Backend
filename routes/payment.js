require("dotenv").config();
const express = require("express");
const { createOrder, paymentSuccess } = require("../controllers/paymentsController");
const { updateRegisterCounter } = require("../middlewares/registerCounter");

const router = express.Router();

// routes
router.route("/orders").post(updateRegisterCounter, createOrder);
router.route("/verify").post(paymentSuccess);

module.exports = router;
