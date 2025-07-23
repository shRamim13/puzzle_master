const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true,
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  questionType: {
    type: String,
    enum: ['riddle', 'question', 'math', 'science', 'internet'],
    default: 'riddle'
  },
  hints: [{
    type: String,
    trim: true
  }],
  points: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

puzzleSchema.index({ level: 1, difficulty: 1 });

module.exports = mongoose.model('Puzzle', puzzleSchema); 