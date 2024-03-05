const fs = require('fs');
const path = require('path');

// Local Files
const { genHashPassword, validatePassword } = require("../utils/password");
const { issueJWT } = require("../utils/jwt");
const { executeQuery } = require("../utils/database");
const {
  insertUserDetailsQuery,
  findUserEmailQuery,
  checkEmployeeQuery,
  changePassword,
} = require("../constants/queries");

const { sendEmail } = require("../utils/sendmail");

// ********************************** Util Functions ***********************************************

const genUid = (counter) => {
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
  const userId = timestampComponent + randomComponent + counterComponent;

  return userId;
};

// ********************************** signup ***********************************************

/**
 *
 * username : maximum char - 50
 * email : maximum char - 100
 *
 */

const createUser = async (req, res) => {
  const { username, email, password, registerCounter } = req.body;

  // Return If Partial Information Provided
  if (username === undefined || email === undefined || password === undefined) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }

  // Return If Data Exceeds Length
  if (username.length > 50 || email.length > 100) {
    return res.status(406).json({ success: false, payload: { message: "Not Acceptable. Data Length Exceeds Limit" } });
  }

  // Hash Password generation
  const { salt, hashPassword } = genHashPassword(password);

  // User Id generation
  const userId = genUid(registerCounter);

  // Insert Into Database
  const details = [userId, username, salt, hashPassword, email];
  const qreryRes = await executeQuery(insertUserDetailsQuery, details);

  // Return If Creation Unsuccessful
  if (!qreryRes.success) {
    return res.status(501).json({ success: qreryRes.success, payload: qreryRes.result });
  }

  // Initialize Profile Database

  return res
    .status(201)
    .json({ success: true, payload: { message: "User Creation Successful" } });
};

// ********************************** login ***********************************************

/**
 *
 * email : maximum char - 100
 * remember : Boolean
 *
 */

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Return If Partial Information Provided
  if (email === undefined || password === undefined) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }

  // Return If Data Exceeds Length
  if (email.length > 100) {
    return res.status(406).json({ success: false, payload: { message: "Not Acceptable. Data Length Exceeds Limit" } });
  }

  // Search User In Database
  const qreryRes = await executeQuery(findUserEmailQuery, [email]);
  const userDetails = qreryRes.result[0];

  // Return If Query Unsuccessful
  if (userDetails.length === 0) {
    return res.status(404).json({ success: false, payload: { message: "User Not Found" } });
  }

  // Extracting user Details
  const userId = userDetails[0].user_id;
  const salt = userDetails[0].password_salt;
  const hashPassword = userDetails[0].password_hash;
  const userName = userDetails[0].username;

  // Validating Password
  const passwordValidity = validatePassword(password, hashPassword, salt);

  // Return If Invalid Password
  if (!passwordValidity) {
    return res.status(401).json({ success: false, payload: { message: "Invalid Password" } });
  }

  // Issue JWT
 const jwt = issueJWT(userId, 1, "d");

  // Check If User is a registered hms employee

  return res.status(201).json({
    success: true,
    payload: {
      message: "User Authenticated Successfully",
      userName, // Include the isEmployee flag in the response
      ...jwt,
    },
  });
};

// ********************************** profile ***********************************************


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body; 
    if (email === undefined) {
      return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
    }

    const qreryRes = await executeQuery(findUserEmailQuery, [email]);
    const userDetails = qreryRes.result[0];
    if (userDetails.length === 0) {
      return res.status(404).json({ success: false, payload: { message: "User Not Found" } });
    }

    const userId = userDetails[0].user_id;

    const { token } = issueJWT(userId, 10, "m");
    const resetPasswordURL = `https://hmsfreedom.com/ResetPassword?state=reset&&token=${token}`;
    const linkText = "Click here";
    const linkElement = `<a href="${resetPasswordURL}">${linkText}</a>`;
    const subject = "Kreative Machinez reset password";
    const message = `you can reset your password here :  ${linkElement}`;
    await sendEmail(email, subject, message);
    res.status(200).json({
      success: true,
      payload: { message: `reset password token sent to mail id ${email} succesfully` },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      payload: { message: error },
    });
  }
};

const resetPassword = async (req, res) => {
  const userId = req.user.user_id;
  const { password } = req.body;
   if (password === undefined) {
     return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
   }
  const { salt, hashPassword } = genHashPassword(password);

  const details = [salt, hashPassword, userId];
  const queryResult = await executeQuery(changePassword, details);

  if (!queryResult.success) {
    return res.status(501).json({ success: false, payload: queryResult.result });
  }

  return res.status(201).json({ success: true, payload: { message: "Password changed successfully." } });
};


module.exports = {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword
};
