const mongoose = require("mongoose");

const reqString = { type: String, required: true };

const orderSchema = new mongoose.Schema(
  {
    busDetails: {
      name: reqString,
      from: reqString,
      to: reqString,
      contactemail: reqString,
      contactphone: reqString,
      arrival: { type: String, required: true },
      departure: { type: String, required: true },
    },

    ticketSummary: {
      date: { type: String, required: true }, // Or Date if you are using Date objects
      ticket: reqString,
      amount: reqString,
    },
    
    paymentDetails: {
      orderId: { type: String, required: true },
      razorpayOrderId: { type: String, required: true },
      razorpayPaymentId: { type: String, required: true },
    },
    
    userDetails: {
      name: reqString,
      age: reqString,
      gender: reqString,
      email: reqString,
      phone: reqString,
    },
       // Optional refund details
       refundDetails: {
        amount: { type: String },
        status: { type: String, enum: ['pending', 'processed', 'failed'], default: 'pending' },
      },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bus",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Optional Indexing for better query performance
orderSchema.index({ user: 1 });
orderSchema.index({ bus: 1 });

const order = mongoose.model("orderssofbuss", orderSchema);

module.exports = order;
