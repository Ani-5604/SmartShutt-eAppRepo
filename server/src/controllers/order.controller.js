const express = require("express");
const BusModel = require("../models/bus.model");
const Order = require("../models/order.model");
const jsPDF = require("jspdf");
const order = require("../models/order.model");
const app = express.Router();

// Create a new order and add it to the bus's seat
app.post("/", async (req, res) => {
  try {
    // Create new order in the database
    const order = await Order.create({ ...req.body });

    // Prepare ticket data for seat reservation
    let ticketdata =
      req.body.ticketSummary.date +
      "@" +
      req.body.ticketSummary.ticket +
      "@" +
      req.body.userDetails.gender;

    // Update the bus seats
    let filter = { _id: req.body.bus };
    let update = { $push: { seats: ticketdata } };
    const busUpdate = await BusModel.findOneAndUpdate(filter, update);

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
});

// Cancel an order and remove the seat from the bus

// Route to handle ticket cancellation
app.post("/myticket/cancel", async (req, res) => {
  const { paymentId, ticketAmount } = req.body;

  if (!paymentId || !ticketAmount) {
    return res.status(400).json({ status: "error", message: "Missing required fields" });
  }

  try {
    // Find the ticket in the database
    const ticket = await order.ticketSummary.findOne(ticketAmount);

    if (!ticket) {
      return res.status(404).json({ status: "error", message: "Ticket not found" });
    }

    // If ticket is already canceled, return early
    if (ticket.status === "canceled") {
      return res.status(400).json({ status: "error", message: "Ticket already canceled" });
    }

    // Update the ticket status to canceled
    ticket.status = "canceled";
    await ticket.save();

    // Optionally, process payment refund logic here

    res.status(200).json({ status: "success", message: "Ticket canceled successfully" });
  } catch (err) {
    console.error("Error canceling ticket:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// Get all tickets of a user
app.post("/myticket", async (req, res) => {
  try {
    const order = await Order.find({ user: req.body.id });
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
});

// Cancel a specific order by ID
app.delete("/oneorder", async (req, res) => {
  const { userName, ticketAmount, paymentDetails } = req.body;

  if (!userName || !ticketAmount || !paymentDetails || !paymentDetails.razorpayPaymentId || !paymentDetails.razorpayOrderId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the order by user name and ticket amount
    const order = await Order.findOne({ 
      "userDetails.name": userName, 
      "ticketSummary.amount": ticketAmount
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    // Validate payment details
    if (
      order.paymentDetails.razorpayPaymentId !== paymentDetails.razorpayPaymentId ||
      order.paymentDetails.razorpayOrderId !== paymentDetails.razorpayOrderId
    ) {
      return res.status(400).json({ message: "Invalid payment details provided." });
    }

    // Remove the order from the database
    await Order.findByIdAndDelete(order._id);

    // Construct the ticket data for removing from the bus seat
    const ticketdata = `${order.ticketSummary.date}@${order.ticketSummary.ticket}@${order.userDetails.gender}`;

    // Remove the seat from the bus model
    const filter = { _id: order.bus }; // Find the bus by its ID
    const update = { $pull: { seats: ticketdata } }; // Pull (remove) the ticket data from the bus seats array
    await BusModel.findOneAndUpdate(filter, update);

    // Send success response
    return res.status(200).json({
      message: "Ticket canceled successfully. Refund will be processed soon.",
    });
  } catch (error) {
    console.error("Error during ticket cancellation:", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
});

// Get tickets for today
app.post("/myticket/today", async (req, res) => {
  const date = new Date().toISOString().split("T")[0];
  try {
    const order = await Order.find();
    let data = order.filter((ele) => {
      let orderDate = new Date(ele.ticketSummary.date).toISOString().split("T")[0];
      return orderDate === date;
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
});

// Get upcoming tickets
app.post("/myticket/upcoming", async (req, res) => {
  const currentDate = new Date();
  try {
    const order = await Order.find({
      "ticketSummary.date": { $gt: currentDate },
    });
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
});

// Get past tickets
app.post("/myticket/past", async (req, res) => {
  const currentDate = new Date().toISOString().split("T")[0];
  try {
    const order = await Order.find({
      "ticketSummary.date": { $lt: new Date(currentDate) },
    });
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
});

// Generate PDF Ticket
app.post("/generate-pdf", async (req, res) => {
  try {
    const { orderId, ticketSummary, busDetails, userDetails } = req.body;

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add Ticket Header
    doc.setFontSize(18);
    doc.text("Ticket Confirmation", 20, 20);

    // Add Order ID
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderId}`, 20, 30);

    // Add User Details
    doc.text("Passenger Details:", 20, 40);
    doc.text(`Name: ${userDetails.name}`, 20, 50);
    doc.text(`Email: ${userDetails.email}`, 20, 60);

    // Add Ticket Details
    doc.text("Ticket Details:", 20, 80);
    doc.text(`Date: ${ticketSummary.date}`, 20, 90);
    doc.text(`Seats: ${ticketSummary.ticket.count}`, 20, 100);
    doc.text(`Amount Paid: INR ${ticketSummary.amount}`, 20, 110);

    // Add Bus Details
    doc.text("Bus Details:", 20, 130);
    doc.text(`Company: ${busDetails.name}`, 20, 140);
    doc.text(`Route: ${busDetails.from} to ${busDetails.to}`, 20, 150);
    doc.text(`Departure: ${busDetails.departure}`, 20, 160);
    doc.text(`Arrival: ${busDetails.arrival}`, 20, 170);
    doc.text(`Contact: ${busDetails.contactemail}, ${busDetails.contactphone}`, 20, 180);

    // Save the PDF to the browser
    const fileName = `Ticket_${orderId}.pdf`;
    doc.save(fileName);

    return res.status(200).json({ message: "PDF ticket generated successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Error generating PDF ticket!" });
  }
});

module.exports = app;
