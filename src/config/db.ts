import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.MONGO_URI as string;

export const connectDatabase = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log("MongoDB connected successfully with Mongoose.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};