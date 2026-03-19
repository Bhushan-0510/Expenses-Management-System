const mongoose = require("mongoose");

async function connectDB() {
  // Allow either MONGO_URI (preferred) or MONGODB_URI for compatibility
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGO_URI (or MONGODB_URI) in environment variables");
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri, {
      // Recommended options for current mongoose versions
      autoIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  } catch (err) {
    // Provide a clearer error message for deploy logs
    // eslint-disable-next-line no-console
    console.error("Failed to connect to MongoDB:", err.message || err);
    throw err;
  }
}

module.exports = connectDB;

