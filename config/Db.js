import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI missing");
  }

  try {
    // Improve connection options for serverless environments
    await mongoose.connect(uri, {
      // these options are safe defaults; mongoose will ignore unknown ones
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Keep server selection timeout short so logs surface quickly
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // rethrow so the caller (server startup) can log and Vercel shows the error
    throw err;
  }
};

export default connectDB;