const Resume = require('../models/Resume');
const JobDescription = require('../models/JobDescription');
const { getMockJDById } = require('../data/mockJDs');
const { analyzeResume } = require('../services/aiService');

// GET /api/resume
const getAllResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: `Found ${resumes.length} resumes`,
      data: resumes
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/resume/:id
const getResumeById = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

// POST /api/resume/upload
const uploadResume = async (req, res, next) => {
  try {
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

    return res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: resume
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/resume/:id
const updateResume = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

// POST /api/resume/:id/screen
const screenResume = async (req, res, next) => {
  try {
    const { jdId } = req.body;

    if (!jdId) {
      return res.status(400).json({
        success: false,
        message: 'Job description ID is required',
        data: null
      });
    }

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

    let jobDescription = '';
    let jdTitle = '';
    let jdSkills = [];

    if (jdId.startsWith('jd-')) {
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
      const jd = await JobDescription.findOne({
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

    const aiResult = await analyzeResume(resumeText, jobDescription);

    if (!aiResult.success) {
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

    const analysis = aiResult.analysis;
    const scoreMatch = analysis.match(/Match Score[:\s]*(\d+)/i) || analysis.match(/(\d+)%/);
    const matchScore = scoreMatch ? parseInt(scoreMatch[1]) : 75;

    const resumeSkills = (resumeData.skills || []).map(s => s.toLowerCase());
    const matchingSkills = jdSkills.filter(skill =>
      resumeSkills.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
    );
    const missingSkills = jdSkills.filter(skill =>
      !resumeSkills.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
    );

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
  } catch (error) {
    next(error);
  }
};

// DELETE /api/resume/:id
const deleteResume = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllResumes, getResumeById, uploadResume, updateResume, screenResume, deleteResume };
