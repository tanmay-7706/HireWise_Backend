const User = require('../models/User');

// GET /api/user/me
const getProfile = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// PUT /api/user/me
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Name is required', 
        data: null 
      });
    }

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
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
