const express = require('express');
const CareerRoadmap = require('../models/CareerRoadmap');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const { generateCareerRoadmap } = require('../services/aiService');

const router = express.Router();

// GET /api/career - Get all roadmaps
router.get('/', auth, async (req, res) => {
    try {
        const roadmaps = await CareerRoadmap.find({ userId: req.user.userId })
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            data: roadmaps
        });
    } catch (err) {
        console.error('Get roadmaps error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch roadmaps'
        });
    }
});

// GET /api/career/:id - Get single roadmap
router.get('/:id', auth, async (req, res) => {
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
    } catch (err) {
        console.error('Get roadmap error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch roadmap'
        });
    }
});

// POST /api/career/generate - Generate new roadmap
router.post('/generate', auth, async (req, res) => {
    try {
        const { targetRole } = req.body;

        if (!targetRole) {
            return res.status(400).json({
                success: false,
                message: 'Target role is required'
            });
        }

        // Fetch user's latest resume to get current skills
        const latestResume = await Resume.findOne({ userId: req.user.userId })
            .sort({ createdAt: -1 });

        const currentSkills = latestResume?.parsedData?.skills || [];

        console.log('Generating roadmap for:', targetRole, 'with skills:', currentSkills);

        // Generate roadmap using AI
        const aiResult = await generateCareerRoadmap(currentSkills, targetRole);

        console.log('AI Result:', aiResult);

        if (!aiResult.success) {
            console.error('AI generation failed:', aiResult.error);

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

        // Save to database
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
    } catch (err) {
        console.error('Generate roadmap error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate roadmap'
        });
    }
});

// DELETE /api/career/:id - Delete roadmap
router.delete('/:id', auth, async (req, res) => {
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
    } catch (err) {
        console.error('Delete roadmap error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete roadmap'
        });
    }
});

module.exports = router;
