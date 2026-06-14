const express = require('express');
const router = express.Router();
const { register, login, getUsers, verifyToken } = require('../controllers/authController');
const { googleLogin } = require('../controllers/oAuth');
const auth = require('../middleware/auth');

router.post('/signup', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/users', getUsers);
router.get('/verify', auth, verifyToken);

module.exports = router;