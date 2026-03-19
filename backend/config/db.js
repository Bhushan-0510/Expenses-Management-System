const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGO_URI in environment variables");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    autoIndex: true
  });
}

module.exports = connectDB;

