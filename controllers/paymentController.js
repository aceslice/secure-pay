const Paystack = require("paystack");
const { savePayment } = require("../models/paymentModel");

// Initialize Paystack with your secret key
const paystack = Paystack(process.env.paystack_secret_key);

// Payment controller
async function makePayment(req, res) {
  const { email, amount, reason } = req.body;

  // Convert amount to pesewas
  const amountInPesewas = amount * 100;

  // Calculate 1% of the amount to transfer
  const transferAmount = amountInPesewas * 0.01;

  // Calculate the amount to charge the user (99% of the deposited amount)
  const chargeAmount = amountInPesewas - transferAmount;

  // Create a payment request on Paystack
  try {
    // Initialize transaction for the charge amount
    const payment = await paystack.initializeTransaction({
      email,
      amount: chargeAmount,
    });

    // Save payment details to MongoDB
    await savePayment({
      email,
      amount,
      reason,
      time: new Date(),
      payment_reference: payment.data.reference,
    });

    const transfer = await paystack.transferRecipient({
      type: "nuban",
      name: process.env.Recipent_name, // Name of the bank account owner
      description: "Default charges",
      account_number: process.env.account_number, // Bank account number
      bank_code: process.env.bank_code, // Bank code for the bank
      currency: process.env.currency,
    });

    // Initiate the transfer
    await paystack.initiateTransfer({
      source: "balance", // Transfer from the Paystack balance
      amount: transferAmount,
      recipient: transfer.data.recipient_code,
    });

    // Return the payment authorization URL to the client
    res.json({ authorization_url: payment.data.authorization_url });
  } catch (error) {
    console.error("Error processing payment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your payment." });
  }
}

module.exports = { makePayment };
