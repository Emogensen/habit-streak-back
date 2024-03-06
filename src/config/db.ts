import mongoose from "mongoose";
import getEnv from "../utils/getEnv";

const connectDB = async () => {
  try {
    const dbUri: string = getEnv("DB_URI");
    await mongoose.connect(dbUri);
    console.log("Successfully connected to MongoDB.");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
