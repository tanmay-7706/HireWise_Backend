require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { authLimiter, generalLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const resumeRoutes = require('./routes/resume');
const jdRoutes = require('./routes/jd');
const interviewRoutes = require('./routes/interview');

const app = express();

// CORS configuration — locked down to specific origins
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://hirewisefrontend.vercel.app',  // Production
      'http://localhost:5173',                 // Local dev
      'http://localhost:5174',
      'http://localhost:3000',
    ];

    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('[CORS] Blocked origin:', origin);
      callback(new Error(`CORS: Origin ${origin} not allowed.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

connectDB();

// Apply general rate limiter to ALL API routes
app.use('/api', generalLimiter);

app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: 'HireWise API is running',
    data: {
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  });
});

// Apply strict rate limiter to auth routes
app.use('/api/auth', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jd', jdRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/career', require('./routes/career'));
app.use('/api/mockjd', require('./routes/mockjd'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`[SERVER] Running on port ${PORT}`);
});

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown(signal) {
  console.log(`\n[SHUTDOWN] Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    console.log('[SHUTDOWN] HTTP server closed.');

    try {
      await mongoose.connection.close();
      console.log('[SHUTDOWN] MongoDB connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('[ERROR] Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('[ERROR] Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}