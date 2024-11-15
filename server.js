const express = require("express");
const bodyParser = require("body-parser");
const paymentRoutes = require("./routes/paymentRoute");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection string
const mongoURI = process.env.MONGODB_URI;
const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

// Connect to MongoDB
client.connect((err) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }
  console.log("Connected to MongoDB");
  const db = client.db("your_database_name");

  app.use("/api", paymentRoutes(db));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
