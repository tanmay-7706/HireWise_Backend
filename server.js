'use strict';

// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const testCrudRoutes = require('./routes/testCrud');

const app = express();

// CORS configuration - Fix for frontend on port 5173
const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
console.log(`🌐 Configuring CORS for: ${frontendOrigin}`);

app.use(cors({
  origin: [frontendOrigin, 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', frontendOrigin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
  } else {
    next();
  }
});

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get('Origin') || 'No Origin'}`);
  next();
});

// Connect to MongoDB Atlas
connectDB();

// Health check endpoint
app.get('/', (req, res) => {
  return res.json({ 
    success: true, 
    message: 'HireWise API is running', 
    data: { 
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      cors: frontendOrigin
    } 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/test/crud', testCrudRoutes);

console.log('✅ Routes mounted: /api/auth, /api/user, /api/test/crud');

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for: ${frontendOrigin}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}`);
});

// Graceful shutdown handling - Fixed mongoose.connection.close()
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown(signal) {
  console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log('🔒 HTTP server closed.');
    
    try {
      // Fixed: Use async/await instead of callback
      await mongoose.connection.close();
      console.log('🗄️ MongoDB connection closed.');
      console.log('✅ Graceful shutdown completed.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}