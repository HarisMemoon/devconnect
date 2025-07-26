import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

console.log('Using DB:', process.env.MONGO_URI);
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 10000, // 10 seconds
    });
    console.log('Connected to test database');
  } catch (error) {
    console.error('Failed to connect to test database:', error.message);
    throw error;
  }
}, 15000); // 15 second timeout for beforeAll

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('Test database cleaned up');
    }
  } catch (error) {
    console.error('Error during cleanup:', error.message);
  }
}, 15000); // 15 second timeout for afterAll
