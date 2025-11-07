const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectToMongo = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectToMongo;
