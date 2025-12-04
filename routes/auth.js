const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const { googleLogin } = require('../controllers/oAuth');

// POST /api/auth/google - Google Login/Signup
router.post('/google', googleLogin);

// Input validation helper
const validateInput = (fields) => {
  const errors = [];

  for (const [key, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${key} is required`);
    }
  }

  return errors;
};

// Password strength validation
const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

// Generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/signup - User registration
router.post('/signup', async (req, res) => {
  console.log('📝 Signup attempt:', { email: req.body.email, hasPassword: !!req.body.password });

  try {
    const { name, email, password } = req.body;

    // Input validation
    const validationErrors = validateInput({ name, email, password });
    if (validationErrors.length > 0) {
      console.log('❌ Validation failed:', validationErrors);
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', '),
        data: null
      });
    }

    // Password strength validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      console.log('❌ Password validation failed');
      return res.status(400).json({
        success: false,
        message: passwordError,
        data: null
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
        data: null
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    console.log('[AUTH] User created successfully:', user.email);

    // Generate JWT token
    const token = generateToken(user._id, user.email);

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      }
    });

  } catch (err) {
    console.error('[AUTH ERROR] Signup error:', err);
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      data: null
    });
  }
});

// POST /api/auth/login - User authentication
router.post('/login', async (req, res) => {
  console.log('[AUTH] Login attempt:', { email: req.body.email, hasPassword: !!req.body.password });

  try {
    const { email, password } = req.body;

    // Input validation
    const validationErrors = validateInput({ email, password });
    if (validationErrors.length > 0) {
      console.log('[AUTH WARN] Login validation failed:', validationErrors);
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', '),
        data: null
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('[AUTH WARN] User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('[AUTH WARN] Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null
      });
    }

    console.log('[AUTH] Login successful:', user.email);

    // Generate JWT token
    const token = generateToken(user._id, user.email);

    // Return success response
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      }
    });

  } catch (err) {
    console.error('[AUTH ERROR] Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      data: null
    });
  }
});

// GET /api/auth/users - Get all users (for testing)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    console.log(`[AUTH] Retrieved ${users.length} users`);

    return res.json({
      success: true,
      message: `Found ${users.length} users`,
      data: users
    });

  } catch (err) {
    console.error('[AUTH ERROR] Fetch users error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      data: null
    });
  }
});

module.exports = router;