// Import required modules
require('dotenv').config();  // Load environment variables
const express = require("express");
const cors = require("cors");
const nodemailer = require('nodemailer');
const cityRouter = require("./src/controllers/city.controller");
const busRouter = require("./src/controllers/bus.controller");
const userRouter = require("./src/controllers/user.controller");
const orderRouter = require("./src/controllers/order.controller");
const paymentController = require('./src/controllers/payment.controller');
const connect = require("./src/configs/db");

const app = express();
const port = process.env.PORT || 8070;  // Use environment PORT if available, else fallback to 8070

// Middleware
app.use(cors({
  origin: "https://snazzy-pudding-c649d6.netlify.app",  // Allow frontend on localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed methods
}));
app.use(express.json());  // Use built-in express middleware to parse JSON requests

// Routes
app.use("/user", userRouter);
app.use("/city", cityRouter);
app.use("/bus", busRouter);
app.use("/order", orderRouter);
app.use("/api/payment", paymentController);  // Razorpay payment route




// Handle any other routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server and connect to DB
app.listen(port, async () => {
  try {
    await connect();
    console.log(`Server is listening on http://localhost:${port}`);
  } catch (error) {
    console.error("Error starting server:", error.message);
  }
});

// Generic error handler for uncaught errors
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err.stack);
  res.status(500).json({
    status: 'Failed',
    message: 'Internal Server Error',
  });
});
