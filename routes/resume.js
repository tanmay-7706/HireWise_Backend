const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllResumes, getResumeById, uploadResume, updateResume, screenResume, deleteResume, generateCoverLetter } = require('../controllers/resumeController');

router.get('/', auth, getAllResumes);
router.get('/:id', auth, getResumeById);
router.post('/upload', auth, upload.single('resume'), uploadResume);
router.put('/:id', auth, updateResume);
router.post('/:id/screen', auth, screenResume);
router.post('/:id/cover-letter', auth, generateCoverLetter);
router.delete('/:id', auth, deleteResume);

module.exports = router;