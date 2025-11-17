import mongoose, { mongo } from "mongoose"
const MONGO_URI=process.env.MONGO_URI;

if(!MONGO_URI)
{
    throw new Error("Please define the mongo db url")
}

export async function connectionToDatabase() {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI!);  // modern way, no options needed
      console.log("Connected to MongoDB");
    }
  }
  