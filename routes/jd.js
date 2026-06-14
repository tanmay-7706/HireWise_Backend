const express = require('express');
const router = express.Router();
const { getAllJDs, getJDById, createJD, updateJD, deleteJD } = require('../controllers/jdController');
const auth = require('../middleware/auth');

router.get('/', auth, getAllJDs);
router.get('/:id', auth, getJDById);
router.post('/', auth, createJD);
router.put('/:id', auth, updateJD);
router.delete('/:id', auth, deleteJD);

module.exports = router;