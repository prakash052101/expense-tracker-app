const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    const uri = process.env.MONGODB_URI
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

module.exports = connectToMongo;
