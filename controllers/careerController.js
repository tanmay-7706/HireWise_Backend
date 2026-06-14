const CareerRoadmap = require('../models/CareerRoadmap');
const Resume = require('../models/Resume');
const { generateCareerRoadmap } = require('../services/aiService');

// GET /api/career - with pagination
const getAllRoadmaps = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [roadmaps, total] = await Promise.all([
      CareerRoadmap.find({ userId: req.user.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CareerRoadmap.countDocuments({ userId: req.user.userId }),
    ]);

    return res.json({
      success: true,
      data: roadmaps,
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

// GET /api/career/:id
const getRoadmapById = async (req, res, next) => {
  try {
    const roadmap = await CareerRoadmap.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    return res.json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/career/generate
const generateRoadmap = async (req, res, next) => {
  try {
    const { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: 'Target role is required'
      });
    }

    const latestResume = await Resume.findOne({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    const currentSkills = latestResume?.parsedData?.skills || [];

    const aiResult = await generateCareerRoadmap(currentSkills, targetRole);

    if (!aiResult.success) {
      // Fallback to mock roadmap if AI fails
      const mockRoadmap = {
        overview: `This is a learning path to become a ${targetRole}. The roadmap is tailored based on your current skills.`,
        roadmap: [
          {
            step: 1,
            title: "Foundation Building",
            description: "Start by solidifying your foundational knowledge in core concepts required for the role.",
            resources: ["Online courses", "Documentation", "Video tutorials"],
            estimatedTime: "2-4 weeks"
          },
          {
            step: 2,
            title: "Intermediate Skills Development",
            description: "Develop intermediate-level skills through hands-on projects and practical exercises.",
            resources: ["Practice platforms", "GitHub projects", "Coding challenges"],
            estimatedTime: "1-2 months"
          },
          {
            step: 3,
            title: "Advanced Concepts",
            description: "Master advanced concepts and best practices used by senior professionals.",
            resources: ["Advanced courses", "System design resources", "Books"],
            estimatedTime: "2-3 months"
          },
          {
            step: 4,
            title: "Real-World Experience",
            description: "Build portfolio projects that demonstrate your expertise and problem-solving abilities.",
            resources: ["Open source contributions", "Personal projects", "Freelance work"],
            estimatedTime: "3-6 months"
          }
        ]
      };

      const newRoadmap = await CareerRoadmap.create({
        userId: req.user.userId,
        targetRole,
        currentSkills,
        overview: mockRoadmap.overview,
        roadmap: mockRoadmap.roadmap
      });

      return res.status(201).json({
        success: true,
        message: 'Career roadmap generated successfully (using fallback)',
        data: newRoadmap
      });
    }

    const { overview, roadmap } = aiResult.data;

    const newRoadmap = await CareerRoadmap.create({
      userId: req.user.userId,
      targetRole,
      currentSkills,
      overview,
      roadmap
    });

    return res.status(201).json({
      success: true,
      message: 'Career roadmap generated successfully',
      data: newRoadmap
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/career/:id
const deleteRoadmap = async (req, res, next) => {
  try {
    const roadmap = await CareerRoadmap.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    return res.json({
      success: true,
      message: 'Roadmap deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllRoadmaps, getRoadmapById, generateRoadmap, deleteRoadmap };
