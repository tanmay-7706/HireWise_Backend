const express = require('express');
const { getAllMockJDs, getMockJDById, getJDsByCategory, getAllCategories } = require('../data/mockJDs');

const router = express.Router();

// GET /api/mockjd - Get all mock JDs with optional category filter
router.get('/', (req, res) => {
    try {
        const { category } = req.query;

        let jds;
        if (category) {
            jds = getJDsByCategory(category);
        } else {
            jds = getAllMockJDs();
        }

        return res.json({
            success: true,
            message: `Found ${jds.length} mock job descriptions`,
            data: jds
        });
    } catch (err) {
        console.error('Get mock JDs error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch mock JDs'
        });
    }
});

// GET /api/mockjd/categories - Get all unique categories
router.get('/categories', (req, res) => {
    try {
        const categories = getAllCategories();

        return res.json({
            success: true,
            data: categories
        });
    } catch (err) {
        console.error('Get categories error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch categories'
        });
    }
});

// GET /api/mockjd/:id - Get specific mock JD by ID
router.get('/:id', (req, res) => {
    try {
        const jd = getMockJDById(req.params.id);

        if (!jd) {
            return res.status(404).json({
                success: false,
                message: 'Mock JD not found'
            });
        }

        return res.json({
            success: true,
            data: jd
        });
    } catch (err) {
        console.error('Get mock JD error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch mock JD'
        });
    }
});

module.exports = router;
