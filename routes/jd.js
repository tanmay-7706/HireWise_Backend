const express = require('express');
const JobDescription = require('../models/JobDescription');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/jd - Get all job descriptions
router.get('/', auth, async (req, res) => {
  try {
    const jds = await JobDescription.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
      
    return res.json({
      success: true,
      message: `Found ${jds.length} job descriptions`,
      data: jds
    });
  } catch (err) {
    console.error('Get JDs error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch job descriptions',
      data: null
    });
  }
});

// GET /api/jd/:id - Get single job description
router.get('/:id', auth, async (req, res) => {
  try {
    const jd = await JobDescription.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!jd) {
      return res.status(404).json({
        success: false,
        message: 'Job description not found',
        data: null
      });
    }
    
    return res.json({
      success: true,
      message: 'Job description retrieved successfully',
      data: jd
    });
  } catch (err) {
    console.error('Get JD error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch job description',
      data: null
    });
  }
});

// POST /api/jd - Create job description
router.post('/', auth, async (req, res) => {
  try {
    const { title, company, description, requirements, skills } = req.body;
    
    const jd = await JobDescription.create({
      userId: req.user.userId,
      title,
      company,
      description,
      requirements: requirements || [],
      skills: skills || []
    });
    
    return res.status(201).json({
      success: true,
      message: 'Job description created successfully',
      data: jd
    });
  } catch (err) {
    console.error('Create JD error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create job description',
      data: null
    });
  }
});

// PUT /api/jd/:id - Update job description
router.put('/:id', auth, async (req, res) => {
  try {
    const jd = await JobDescription.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!jd) {
      return res.status(404).json({
        success: false,
        message: 'Job description not found',
        data: null
      });
    }
    
    return res.json({
      success: true,
      message: 'Job description updated successfully',
      data: jd
    });
  } catch (err) {
    console.error('Update JD error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update job description',
      data: null
    });
  }
});

// DELETE /api/jd/:id - Delete job description
router.delete('/:id', auth, async (req, res) => {
  try {
    const jd = await JobDescription.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!jd) {
      return res.status(404).json({
        success: false,
        message: 'Job description not found',
        data: null
      });
    }
    
    return res.json({
      success: true,
      message: 'Job description deleted successfully',
      data: jd
    });
  } catch (err) {
    console.error('Delete JD error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete job description',
      data: null
    });
  }
});

module.exports = router;