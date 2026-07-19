import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusroom';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('☘️ MongoDB database connected successfully');
  } catch (error) {
    console.error('❌ MongoDB database connection error:', error);
    process.exit(1);
  }
};
