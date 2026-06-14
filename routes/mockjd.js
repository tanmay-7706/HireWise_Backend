const express = require('express');
const router = express.Router();
const { getAllMockJDsHandler, getCategoriesHandler, getMockJDByIdHandler } = require('../controllers/mockjdController');

router.get('/', getAllMockJDsHandler);
router.get('/categories', getCategoriesHandler);
router.get('/:id', getMockJDByIdHandler);

module.exports = router;
