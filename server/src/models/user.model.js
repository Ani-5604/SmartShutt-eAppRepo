const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Ensure unique emails for users
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  otp: {
    type: String,  // To store the OTP sent to the user
  },
  otpExpiry: {
    type: Date,  // To store the expiry time for the OTP
  },
});

// Create the User model
const UserModel = model("userssofapp", UserSchema);

module.exports = UserModel;
