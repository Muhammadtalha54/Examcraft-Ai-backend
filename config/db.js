const mongoose = require('mongoose');
require('dotenv').config();

// Global connection flag for persistent connection
let isConnected = false;

// Connect to MongoDB Atlas database with persistent connection
const connectDB = async () => {
  // If already connected, reuse existing connection
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    isConnected = false;
    throw error;
  }
};

module.exports = connectDB;