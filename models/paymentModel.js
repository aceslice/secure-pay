const mongoose = require("mongoose");

// Define schema for payments collection
const paymentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  time: { type: Date, default: Date.now },
  payment_reference: { type: String, required: true },
});

// Create model for payments collection
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
