const mongoose = require('mongoose');

const careerRoadmapSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetRole: {
        type: String,
        required: true
    },
    currentSkills: [String],
    roadmap: [{
        step: Number,
        title: String,
        description: String,
        resources: [String],
        estimatedTime: String,
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending'
        }
    }],
    overview: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CareerRoadmap', careerRoadmapSchema);
