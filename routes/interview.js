const express = require('express');
const router = express.Router();
const { getAllInterviews, getInterviewById, startInterview, updateInterview, deleteInterview, chat, generateQuestions, analyze } = require('../controllers/interviewController');
const auth = require('../middleware/auth');

router.get('/', auth, getAllInterviews);
router.get('/:id', auth, getInterviewById);
router.post('/start', auth, startInterview);
router.put('/:id', auth, updateInterview);
router.delete('/:id', auth, deleteInterview);
router.post('/:id/chat', auth, chat);
router.post('/:id/questions', auth, generateQuestions);
router.post('/:id/analyze', auth, analyze);

module.exports = router;