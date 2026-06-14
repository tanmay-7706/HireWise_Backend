const JobDescription = require('../models/JobDescription');

// GET /api/jd - with pagination
const getAllJDs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [jds, total] = await Promise.all([
      JobDescription.find({ userId: req.user.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      JobDescription.countDocuments({ userId: req.user.userId }),
    ]);

    return res.json({
      success: true,
      message: `Found ${total} job descriptions`,
      data: jds,
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

// GET /api/jd/:id
const getJDById = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

// POST /api/jd
const createJD = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

// PUT /api/jd/:id
const updateJD = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

// DELETE /api/jd/:id
const deleteJD = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllJDs, getJDById, createJD, updateJD, deleteJD };
