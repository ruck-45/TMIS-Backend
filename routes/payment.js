require("dotenv").config();
const express = require("express");
const { createOrder, paymentSuccess } = require("../controllers/paymentsController");


const router = express.Router();


router.route("/orders").post(createOrder);
router.route("/success").post(paymentSuccess);

module.exports = router;
