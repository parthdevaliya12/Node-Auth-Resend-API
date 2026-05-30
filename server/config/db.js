import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

if (!process.env.MONGODB_URL) {
  throw new Error("Please provide mongoDB uri from .env");
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB connected...");
  } catch (error) {
    console.log(error.message);
    process.exit(1)
  }
};

export default connectDB;
