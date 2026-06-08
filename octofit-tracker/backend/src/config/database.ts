import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/octofit_db";

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(mongoUri);
}

export { mongoUri };
