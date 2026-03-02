const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("MongoDB conectada");
  } catch (error) {
    console.log("Error conectando MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;