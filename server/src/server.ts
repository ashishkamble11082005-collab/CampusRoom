import app from './app';
import { connectDB } from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start Express Server
  app.listen(PORT, () => {
    console.log(`🚀 Authentication server listening on: http://localhost:${PORT}`);
  });
};

startServer();
