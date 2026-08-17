import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';
const connectOptions = {
  serverSelectionTimeoutMS: 5000,
  dbName: 'kindered',
};

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, connectOptions);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.warn(`MongoDB unavailable at ${MONGO_URI}. Starting app without DB.`);
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
