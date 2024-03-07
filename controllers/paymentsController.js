const Razorpay = require("razorpay");
const crypto = require("crypto");

const { executeQuery } = require("../utils/database");
const { createPaymentQuery } = require("../constants/queries");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const genReceiptId = (counter) => {
  // Timestamp component (YYYYMMDDHHMMSS)
  const currentDate = new Date();
  const timestampComponent = currentDate.toISOString().slice(0, 19).replace(/[-:T]/g, "");

  // Random component (5 digits)
  const randomComponent = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");

  // Counter Component - Resets every Day
  const counterComponent = counter.toString().padStart(5, "0");

  // UserId
  const rId = timestampComponent + randomComponent + counterComponent;

  return rId;
};

const paymentSuccess = async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  // Return If Partial Information Provided
  if (razorpayPaymentId === undefined || razorpayOrderId === undefined || razorpaySignature === undefined) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }

  try {
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
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
  const { totalAmt, cur, registerCounter } = req.body;

  if (totalAmt === undefined || cur === undefined || registerCounter === undefined) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }

  rId = genReceiptId(registerCounter);

  options = {
    amount: totalAmt * 100,
    currency: cur,
    receipt: `${rId}`,
  };

  try {
    const order = await instance.orders.create(options);
    if (!order) return res.status(404).json({ success: false, payload: { message: "Order Creation Failed" } });
    return res.status(201).json({ success: true, payload: { order, message: "Order Creation Successful" } });
  } catch (error) {
    return res.status(500).json({ success: false, payload: { message: "Order Creation Failed" } });
  }
};

const updateDatabase = async (req, res) => {
  const {
    userName,
    email,
    companyName,
    phoneNumber,
    address,
    service,
    plan,
    successReceiptId,
    successOrderId,
    amount,
  } = req.body;
  const paymentInfo = {
    payment_id: successReceiptId,
    order_id: successOrderId,
    name: userName,
    email: email,
    company_name: companyName,
    phone: phoneNumber,
    address: address,
    service_1: service[0] || "",
    plan_1: plan[0] || "",
    service_2: service[1] || "",
    plan_2: plan[1] || "",
    service_3: service[2] || "",
    plan_3: plan[2] || "",
    service_4: service[3] || "",
    plan_4: plan[3] || "",
    currency: "INR",
    total_amount: amount / 100,
  };
  const paymentParams = [
    paymentInfo.payment_id,
    paymentInfo.order_id,
    paymentInfo.name,
    paymentInfo.email,
    paymentInfo.company_name,
    paymentInfo.phone,
    paymentInfo.address,
    paymentInfo.service_1,
    paymentInfo.plan_1,
    paymentInfo.service_2,
    paymentInfo.plan_2,
    paymentInfo.service_3,
    paymentInfo.plan_3,
    paymentInfo.service_4,
    paymentInfo.plan_4,
    paymentInfo.currency,
    paymentInfo.total_amount,
  ];
  const createEntry = await executeQuery(createPaymentQuery, paymentParams);
  console.log("createEntry", createEntry);
  if (!createEntry.success) {
    return res.status(404).json({ success: false, payload: { message: "Error while updating database." } });
  }
  return res.status(201).json({ success: true, payload: { message: "Entry created in databse succesfully." } });
};

module.exports = {
  createOrder,
  paymentSuccess,
  updateDatabase,
};
