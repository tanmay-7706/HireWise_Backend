const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/user/me - Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    // Find user by ID from JWT token
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found', 
        data: null 
      });
    }

    return res.json({ 
      success: true, 
      message: 'Profile retrieved successfully', 
      data: user 
    });
    
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve profile', 
      data: null 
    });
  }
});

// PUT /api/user/me - Update current user profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Name is required', 
        data: null 
      });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name: name.trim(), updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found', 
        data: null 
      });
    }

    return res.json({ 
      success: true, 
      message: 'Profile updated successfully', 
      data: user 
    });
    
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile', 
      data: null 
    });
  }
});

module.exports = router;