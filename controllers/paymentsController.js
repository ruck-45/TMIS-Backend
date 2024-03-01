const Razorpay = require("razorpay");
const crypto = require("crypto");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const paymentSuccess = async (req, res) => {
  console.log("check");
  const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  console.log("check payment");
  // Return If Partial Information Provided
  if (
    orderCreationId === undefined ||
    razorpayPaymentId === undefined ||
    razorpayOrderId === undefined ||
    razorpaySignature === undefined
  ) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }

  try {
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature) {
      return res.status(400).json({ success: false, payload: { message: "Signature Mismatch" } });
    }

    return res.json({
      success: true,
      payload: {
        message: "Payment Successful",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, payload: { message: "Payment Failed" } });
  }
};

const createOrder = async (req, res) => {
  const { totalAmt, cur } = req.body;
  console.log(totalAmt)
  options = {
    amount: totalAmt * 100,
    currency: cur,
    receipt: "receipt_id",
  };
  if (totalAmt === undefined) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }

  try {
    const order = await instance.orders.create(options);
    if (!order) return res.status(404).json({ success: false, payload: { message: "Order Creation Failed" } });
    return res.status(201).json({ success: true, payload: { order, message: "Order Creation Successful" } });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, payload: { message: "Order Creation Failed" } });
  }
};

module.exports = {
  createOrder,
  paymentSuccess,
};
