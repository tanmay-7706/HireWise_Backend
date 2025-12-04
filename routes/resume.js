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
const { analyzeResume } = require('../services/aiService');
const JD = require('../models/JobDescription');
const { getMockJDById } = require('../data/mockJDs');

router.post('/:id/screen', auth, async (req, res) => {
  try {
    const { jdId } = req.body;

    if (!jdId) {
      return res.status(400).json({
        success: false,
        message: 'Job description ID is required',
        data: null
      });
    }

    // Get resume
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

    // Get job description (check if it's a mock JD or user JD)
    let jobDescription = '';
    let jdTitle = '';
    let jdSkills = [];

    if (jdId.startsWith('jd-')) {
      // It's a mock JD
      const mockJD = getMockJDById(jdId);
      if (!mockJD) {
        return res.status(404).json({
          success: false,
          message: 'Mock job description not found',
          data: null
        });
      }
      jobDescription = mockJD.description;
      jdTitle = mockJD.title;
      jdSkills = mockJD.skills || [];
    } else {
      // It's a user's JD from database
      const jd = await JD.findOne({
        _id: jdId,
        userId: req.user.userId
      });

      if (!jd) {
        return res.status(404).json({
          success: false,
          message: 'Job description not found',
          data: null
        });
      }
      jobDescription = jd.description;
      jdTitle = jd.title;
      jdSkills = jd.skills || [];
    }

    // Build resume text from parsed data
    const resumeData = resume.parsedData || {};
    const resumeText = `
Name: ${resumeData.name || 'Not specified'}
Email: ${resumeData.email || 'Not specified'}
Phone: ${resumeData.phone || 'Not specified'}
Skills: ${(resumeData.skills || []).join(', ') || 'Not specified'}
Experience: ${(resumeData.experience || []).map(exp =>
      `${exp.title || ''} at ${exp.company || ''} (${exp.duration || ''}): ${exp.description || ''}`
    ).join('\n') || 'Not specified'}
Education: ${(resumeData.education || []).map(edu =>
      `${edu.degree || ''} from ${edu.institution || ''} (${edu.year || ''})`
    ).join('\n') || 'Not specified'}
`.trim();

    console.log('Screening resume against JD:', jdTitle);

    // Use Gemini AI to analyze
    const aiResult = await analyzeResume(resumeText, jobDescription);

    if (!aiResult.success) {
      console.error('AI Analysis failed:', aiResult.error);
      // Fall back to keyword matching if AI fails
      const resumeSkills = (resumeData.skills || []).map(s => s.toLowerCase());
      const matchingSkills = jdSkills.filter(skill =>
        resumeSkills.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
      );
      const missingSkills = jdSkills.filter(skill =>
        !resumeSkills.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
      );
      const matchScore = Math.round((matchingSkills.length / Math.max(jdSkills.length, 1)) * 100);

      resume.status = 'screened';
      await resume.save();

      return res.json({
        success: true,
        message: 'Resume screened using keyword matching (AI unavailable)',
        data: {
          matchScore,
          matchingSkills,
          missingSkills,
          analysis: `Based on keyword matching, your resume matches ${matchScore}% of the required skills for this ${jdTitle} position.`
        }
      });
    }

    // Parse AI analysis to extract match score and skills
    const analysis = aiResult.analysis;

    // Extract match score from analysis
    const scoreMatch = analysis.match(/Match Score[:\s]*(\d+)/i) || analysis.match(/(\d+)%/);
    const matchScore = scoreMatch ? parseInt(scoreMatch[1]) : 75;

    // Find matching and missing skills using AI analysis and keyword matching
    const resumeSkills = (resumeData.skills || []).map(s => s.toLowerCase());
    const matchingSkills = jdSkills.filter(skill =>
      resumeSkills.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
    );
    const missingSkills = jdSkills.filter(skill =>
      !resumeSkills.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
    );

    // Update resume status
    resume.status = 'screened';
    resume.lastScreenedAt = new Date();
    await resume.save();

    return res.json({
      success: true,
      message: 'Resume screened successfully with AI analysis',
      data: {
        matchScore: Math.min(matchScore, 100),
        matchingSkills,
        missingSkills,
        analysis
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