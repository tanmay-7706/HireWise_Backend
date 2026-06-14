const express = require('express');
const router = express.Router();
const { getAllRoadmaps, getRoadmapById, generateRoadmap, deleteRoadmap } = require('../controllers/careerController');
const auth = require('../middleware/auth');

router.get('/', auth, getAllRoadmaps);
router.get('/:id', auth, getRoadmapById);
router.post('/generate', auth, generateRoadmap);
router.delete('/:id', auth, deleteRoadmap);

module.exports = router;
