const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDB = async () => {
  try {
    // Use the MongoDB URL from your .env file
    await mongoose.connect(process.env.MONGO_DB_URL)
    console.log('MongoDB connected successfully');
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectDB;