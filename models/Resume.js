const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  parsedData: {
    name: String,
    email: String,
    phone: String,
    skills: [String],
    experience: [String],
    education: [String]
  },
  status: {
    type: String,
    enum: ['uploaded', 'parsed', 'screened'],
    default: 'uploaded'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);