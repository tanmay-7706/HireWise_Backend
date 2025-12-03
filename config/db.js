const mongoose = require('mongoose');

// MongoDB connection with enhanced error handling
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  
  // Validate MongoDB URI
  if (!uri) {
    console.error('❌ MONGO_URI environment variable is not set');
    console.error('💡 Please set MONGO_URI in your environment variables or .env file');
    console.error('📖 See SECURITY.md for setup instructions');
    process.exit(1);
  }

  try {
    // Connection options for stability
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    };

    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, options);
    
    console.log('✅ MongoDB Atlas connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🏠 Host: ${mongoose.connection.host}`);
    
    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('🔍 Check your MONGO_URI and network connection');
    process.exit(1);
  }
};

module.exports = connectDB;