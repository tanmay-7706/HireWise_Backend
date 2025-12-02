const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [String],
  skills: [String],
  experience: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    default: 'entry'
  },
  location: String,
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);