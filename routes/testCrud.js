const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Sample schema for CRUD testing
const sampleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: { 
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Create or get existing model
const Sample = mongoose.models.Sample || mongoose.model('Sample', sampleSchema);

// Input validation helper
const validateSampleInput = (title, description) => {
  const errors = [];
  
  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (title && title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }
  
  if (description && description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }
  
  return errors;
};

// POST /api/test/crud - Create new sample document
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Validate input
    const validationErrors = validateSampleInput(title, description);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: validationErrors.join(', '), 
        data: null 
      });
    }

    // Create document
    const document = await Sample.create({ 
      title: title.trim(), 
      description: description ? description.trim() : undefined 
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Document created successfully', 
      data: document 
    });
    
  } catch (err) {
    console.error('Create document error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create document', 
      data: null 
    });
  }
});

// GET /api/test/crud - Get all sample documents
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const documents = await Sample.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Sample.countDocuments();

    return res.json({ 
      success: true, 
      message: `Retrieved ${documents.length} documents`, 
      data: {
        documents,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (err) {
    console.error('Fetch documents error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch documents', 
      data: null 
    });
  }
});

// GET /api/test/crud/:id - Get single document by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid document ID', 
        data: null 
      });
    }

    const document = await Sample.findById(id);
    
    if (!document) {
      return res.status(404).json({ 
        success: false, 
        message: 'Document not found', 
        data: null 
      });
    }

    return res.json({ 
      success: true, 
      message: 'Document retrieved successfully', 
      data: document 
    });
    
  } catch (err) {
    console.error('Get document error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve document', 
      data: null 
    });
  }
});

// PUT /api/test/crud/:id - Update document by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid document ID', 
        data: null 
      });
    }

    // Validate input
    const validationErrors = validateSampleInput(title, description);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: validationErrors.join(', '), 
        data: null 
      });
    }

    // Update document
    const document = await Sample.findByIdAndUpdate(
      id,
      { 
        title: title.trim(), 
        description: description ? description.trim() : undefined,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!document) {
      return res.status(404).json({ 
        success: false, 
        message: 'Document not found', 
        data: null 
      });
    }

    return res.json({ 
      success: true, 
      message: 'Document updated successfully', 
      data: document 
    });
    
  } catch (err) {
    console.error('Update document error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to update document', 
      data: null 
    });
  }
});

// DELETE /api/test/crud/:id - Delete document by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid document ID', 
        data: null 
      });
    }

    const document = await Sample.findByIdAndDelete(id);
    
    if (!document) {
      return res.status(404).json({ 
        success: false, 
        message: 'Document not found', 
        data: null 
      });
    }

    return res.json({ 
      success: true, 
      message: 'Document deleted successfully', 
      data: document 
    });
    
  } catch (err) {
    console.error('Delete document error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to delete document', 
      data: null 
    });
  }
});

module.exports = router;