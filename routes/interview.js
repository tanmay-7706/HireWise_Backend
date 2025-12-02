const express = require('express');
const Interview = require('../models/Interview');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/interview - Get all interviews
router.get('/', auth, async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
      
    return res.json({
      success: true,
      message: `Found ${interviews.length} interviews`,
      data: interviews
    });
  } catch (err) {
    console.error('Get interviews error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch interviews',
      data: null
    });
  }
});

// GET /api/interview/:id - Get single interview
router.get('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
        data: null
      });
    }
    
    return res.json({
      success: true,
      message: 'Interview retrieved successfully',
      data: interview
    });
  } catch (err) {
    console.error('Get interview error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch interview',
      data: null
    });
  }
});

// POST /api/interview/start - Start new interview
router.post('/start', auth, async (req, res) => {
  try {
    const { type = 'mock' } = req.body;
    
    const interview = await Interview.create({
      userId: req.user.userId,
      type,
      status: 'started'
    });
    
    return res.status(201).json({
      success: true,
      message: 'Interview started successfully',
      data: interview
    });
  } catch (err) {
    console.error('Start interview error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to start interview',
      data: null
    });
  }
});

// PUT /api/interview/:id - Update interview
router.put('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
        data: null
      });
    }
    
    return res.json({
      success: true,
      message: 'Interview updated successfully',
      data: interview
    });
  } catch (err) {
    console.error('Update interview error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update interview',
      data: null
    });
  }
});

// DELETE /api/interview/:id - Delete interview
router.delete('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
        data: null
      });
    }
    
    return res.json({
      success: true,
      message: 'Interview deleted successfully',
      data: interview
    });
  } catch (err) {
    console.error('Delete interview error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete interview',
      data: null
    });
  }
});

module.exports = router;