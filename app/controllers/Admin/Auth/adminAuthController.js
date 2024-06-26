const Admin = require("../../../models/Admin");
const Token = require("../../../models/Token");
const jwt = require("jsonwebtoken");
const twilio = require("../../../../utils/twilio/twilio");
const twilioVerify = require("../../../../utils/twilio/twilioVerify");
const bcrypt = require("bcrypt");
const { makeJsonResponse } = require('../../../../utils/response')
module.exports = {
  // Admin login
  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(401).json(makeJsonResponse("Admin not found", {}, {}, 401, false));
      }

      // Validate password
      const isValidPassword = await admin.isValidPassword(password);
      if (!isValidPassword) {
        return res.status(401).json(makeJsonResponse("Incorrect password", {}, {}, 401, false));
      }

      // Generate JWT token
      const token = jwt.sign({ _id: admin._id }, process.env.SECRET_KEY_JWT || '$123EA$456$9633972298$', {
        expiresIn: "1h",
      });

      await Token.create({ token, from: "admin", userId: admin._id });

      // Respond with token
      res.status(200).json(makeJsonResponse("Login successful", { token }, {}, 200, true));
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json(makeJsonResponse("Some error occurred", {}, [error.message], 500, false));
    }
  },

  //admin password reset
  //send otp to registered phone number
  SendOtp: async (req, res) => {
    try {
      const { mobileNumber } = req.body;
      const exist = await Admin.findOne({ mobileNumber });

      if (exist) {
        twilio(mobileNumber)
          .then(() => {
            const response = makeJsonResponse("OTP sent successfully", { mobileNumber }, {}, 200, true);
            return res.status(200).json(response);
          })
          .catch((error) => {
            console.error("Error sending OTP:", error);
            const response = makeJsonResponse(
              "Failed to send OTP",
              [],
              [error.message],
              500,
              false
            );
            return res.status(500).json(response);
          });
      } else {
        const response = makeJsonResponse("No user found", {}, {}, 404, false);
        return res.status(404).json(response);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      const response = makeJsonResponse("Internal server error", {}, [error.message], 500, false);
      return res.status(500).json(response);
    }
  },

  //admin password reset
  // verify otp
  verifyOtp: async (req, res) => {
    try {
      const { mobileNumber, otp } = req.body;
      const verificationCheck = await twilioVerify(mobileNumber, otp);

      if (verificationCheck && verificationCheck.status === "approved") {
        return res
          .status(200)
          .json(makeJsonResponse("OTP verified successfully", { mobileNumber }, {}, 200, true));
      } else {
        return res
          .status(400)
          .json(makeJsonResponse("OTP verification failed,Incorrect OTP", {}, {}, 400, false));
      }
    } catch (error) {
      return res
        .status(500)
        .json(makeJsonResponse("Error verifying OTP", {}, [error.message], 500, false));
    }
  },

  // update password
  UpdatePassword: async (req, res) => {
    try {
      const { mobileNumber, password } = req.body;
      const newpassword = await bcrypt.hash(password, 10);

      const updatedAdmin = await Admin.findOneAndUpdate(
        { phone:mobileNumber },
        { $set: { password: newpassword } }
      );

      if (updatedAdmin) {
        return res
          .status(200)
          .json(makeJsonResponse("Password updated successfully", {}, {}, 200, true));
      } else {
        return res
          .status(400)
          .json(makeJsonResponse("Error changing password", {}, {}, 400, false));
      }
    } catch (error) {
      return res
        .status(500)
        .json(makeJsonResponse("Error updating password", {}, [error.message], 500, false));
    }
  },
};
