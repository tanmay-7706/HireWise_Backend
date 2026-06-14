const { getAllMockJDs, getMockJDById, getJDsByCategory, getAllCategories } = require('../data/mockJDs');

// GET /api/mockjd
const getAllMockJDsHandler = (req, res, next) => {
  try {
    const { category } = req.query;
    const jds = category ? getJDsByCategory(category) : getAllMockJDs();

    return res.json({
      success: true,
      message: `Found ${jds.length} mock job descriptions`,
      data: jds
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/mockjd/categories
const getCategoriesHandler = (req, res, next) => {
  try {
    const categories = getAllCategories();

    return res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/mockjd/:id
const getMockJDByIdHandler = (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllMockJDsHandler, getCategoriesHandler, getMockJDByIdHandler };
