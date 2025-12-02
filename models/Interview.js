const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['mock', 'practice', 'assessment'],
    default: 'mock'
  },
  questions: [{
    question: String,
    answer: String,
    score: Number,
    feedback: String
  }],
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: String,
  duration: Number, // in minutes
  status: {
    type: String,
    enum: ['started', 'in_progress', 'completed', 'cancelled'],
    default: 'started'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', interviewSchema);