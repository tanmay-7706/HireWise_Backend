const Interview = require('../models/Interview');
const { evaluateAnswer, generateInterviewQuestions, chatWithAI } = require('../services/aiService');

// GET /api/interview - with pagination
const getAllInterviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [interviews, total] = await Promise.all([
      Interview.find({ userId: req.user.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Interview.countDocuments({ userId: req.user.userId }),
    ]);

    return res.json({
      success: true,
      message: `Found ${total} interviews`,
      data: interviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/interview/:id
const getInterviewById = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

// POST /api/interview/start
const startInterview = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

// PUT /api/interview/:id
const updateInterview = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

// DELETE /api/interview/:id
const deleteInterview = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

// POST /api/interview/:id/chat
const chat = async (req, res, next) => {
  try {
    const { message, jobTitle, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    const result = await chatWithAI(message, jobTitle, context);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate AI response',
        error: result.error
      });
    }

    return res.json({
      success: true,
      data: {
        message: result.message,
        timestamp: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/interview/:id/questions
const generateQuestions = async (req, res, next) => {
  try {
    const { jobTitle, level, count } = req.body;

    const result = await generateInterviewQuestions(jobTitle || 'Software Engineer', level || 'mid', count || 5);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate questions',
        error: result.error
      });
    }

    return res.json({
      success: true,
      data: result.questions
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllInterviews, getInterviewById, startInterview, updateInterview, deleteInterview, chat, generateQuestions };
