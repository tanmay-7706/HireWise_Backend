const express = require('express');
const multer = require('multer');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'));
    }
  }
});

const router = express.Router();

// GET /api/resume - Get all resumes for user
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
      
    return res.json({
      success: true,
      message: `Found ${resumes.length} resumes`,
      data: resumes
    });
  } catch (err) {
    console.error('Get resumes error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch resumes',
      data: null
    });
  }
});

// GET /api/resume/:id - Get single resume
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
        data: null
      });
    }
    
    return res.json({
      success: true,
      message: 'Resume retrieved successfully',
      data: resume
    });
  } catch (err) {
    console.error('Get resume error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch resume',
      data: null
    });
  }
});

// POST /api/resume/upload - Upload resume
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    console.log('Resume upload request - File:', req.file ? 'Present' : 'Missing');
    console.log('Resume upload request - Body:', req.body);
    
    if (!req.file && !req.body.filename) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
        data: null
      });
    }
    
    const filename = req.file ? `${Date.now()}_${req.file.originalname}` : req.body.filename || `resume_${Date.now()}.pdf`;
    const originalName = req.file ? req.file.originalname : req.body.originalName || 'Resume.pdf';
    const fileSize = req.file ? req.file.size : req.body.fileSize || 1024;
    const mimeType = req.file ? req.file.mimetype : req.body.mimeType || 'application/pdf';
    
    const resume = await Resume.create({
      userId: req.user.userId,
      filename,
      originalName,
      fileSize,
      mimeType,
      status: 'uploaded',
      parsedData: {
        name: req.body.name || '',
        email: req.body.email || '',
        phone: req.body.phone || '',
        skills: Array.isArray(req.body.skills) ? req.body.skills : [],
        experience: Array.isArray(req.body.experience) ? req.body.experience : [],
        education: Array.isArray(req.body.education) ? req.body.education : []
      }
    });
    
    console.log('Resume created:', resume._id);
    
    return res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: resume
    });
  } catch (err) {
    console.error('Upload resume error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to upload resume',
      data: null
    });
  }
});

// PUT /api/resume/:id - Update resume
router.put('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
        data: null
      });
    }
    
    return res.json({
      success: true,
      message: 'Resume updated successfully',
      data: resume
    });
  } catch (err) {
    console.error('Update resume error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update resume',
      data: null
    });
  }
});

// POST /api/resume/:id/screen - Screen resume against job description
router.post('/:id/screen', auth, async (req, res) => {
  try {
    const { jdId } = req.body;
    
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
        data: null
      });
    }
    
    // Update resume status to screened
    resume.status = 'screened';
    await resume.save();
    
    return res.json({
      success: true,
      message: 'Resume screened successfully',
      data: {
        resume,
        score: 85, // Mock score
        feedback: 'Good match for the position'
      }
    });
  } catch (err) {
    console.error('Screen resume error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to screen resume',
      data: null
    });
  }
});

// DELETE /api/resume/:id - Delete resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
        data: null
      });
    }
    
    return res.json({
      success: true,
      message: 'Resume deleted successfully',
      data: resume
    });
  } catch (err) {
    console.error('Delete resume error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete resume',
      data: null
    });
  }
});

module.exports = router;