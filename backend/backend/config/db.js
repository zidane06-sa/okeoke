const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Gunakan Local MongoDB, bukan Atlas
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rpl_db';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.log('⚠️ Make sure MongoDB is running: mongod');
    process.exit(1);
  }
};

module.exports = connectDB;
