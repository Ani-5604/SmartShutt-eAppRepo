const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const UserModel = require("../models/user.model");

const app = express.Router();

// Nodemailer setup for sending OTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILERUSER,  // Your email from environment variables
    pass: process.env.NODEMAILERPASSWORD,  // Your app-specific password
  },
});

// Generate a random OTP for password reset
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// **Signup Route**
app.post("/signup", async (req, res) => {
  let { email, name, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).send({
        status: "Failed",
        message: "Email is already registered. Please try with a different email.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await UserModel.create({ ...req.body, password: hashedPassword });
    return res.status(201).send({
      status: "Success",
      message: "Signup successful. You can now log in.",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).send({
      status: "Failed",
      message: "Internal server error. Please try again.",
    });
  }
});

// **Login Route**
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).send({
        status: "Failed",
        message: "User not found. Please check your email address.",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        status: "Failed",
        message: "Invalid password. Please try again.",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const { password: _, ...userData } = user.toObject();
    return res.status(200).send({
      status: "Success",
      message: { user: userData, token },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).send({
      status: "Failed",
      message: "Internal server error. Please try again later.",
    });
  }
});

// **Submit OTP (initiate password reset)**
app.post("/submit-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        status: "Failed",
        message: "User not found. Please check your email.",
      });
    }
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    const mailOptions = {
      from: process.env.NODEMAILERUSER,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).send({
      status: "Success",
      message: "OTP has been sent to your email.",
    });
  } catch (error) {
    console.error("Submit OTP Error:", error);
    return res.status(500).send({
      status: "Failed",
      message: "Internal server error. Please try again.",
    });
  }
});

// **Verify OTP**
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await UserModel.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).send({
        status: "Failed",
        message: "User not found.",
      });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp) {
      return res.status(400).send({
        status: "Failed",
        message: "Invalid OTP.",
      });
    }

    // Check if OTP has expired (10 minutes)
    if (user.otpExpiry < Date.now()) {
      return res.status(400).send({
        status: "Failed",
        message: "OTP has expired.",
      });
    }

    // Clear OTP and expiry after successful verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).send({
      status: "Success",
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).send({
      status: "Failed",
      message: "Internal server error. Please try again.",
    });
  }
});

// **Reset Password**
app.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        status: "Failed",
        message: "User not found with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).send({
      status: "Success",
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).send({
      status: "Failed",
      message: "Internal server error. Please try again.",
    });
  }
});

module.exports = app;
