require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");


const router = express.Router();
const paymentSuccess = async (req, res) => {
  try {
    const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature) {
        return res.status(400).json({ success: false, payload: { message: "Transaction not legit!" }} );
    }
    res.json({
      success: true,
      payload: {
        message: "success",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, payload: { message: "Internal Server Error." } });
  }
};

const createOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: 50000, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(400).json({ success: false, payload: { message: "Order Can not be created" } });

    res.status(201).json({ success: true, payload: { order,  message: "Transaction not legit!" } });
  } catch (error) {
    res.status(500).json({ success: false, payload: { message: "Internal Server Error." } });
  }
};

router.route("/orders").post(createOrder);
router.route("/success").post(paymentSuccess);

module.exports = router;
