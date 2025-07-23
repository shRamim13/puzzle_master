const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamName: {
    type: String,
    required: true
  },
  currentLevel: {
    type: Number,
    default: 1
  },
  currentDifficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  completedLevels: [{
    level: Number,
    difficulty: String,
    puzzleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Puzzle'
    },
    startTime: Date,
    endTime: Date,
    timeTaken: Number,
    points: Number
  }],
  totalPoints: {
    type: Number,
    default: 0
  },
  totalTime: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  }
}, {
  timestamps: true
});

gameSessionSchema.index({ teamId: 1, status: 1 });
gameSessionSchema.index({ totalPoints: -1, totalTime: 1 });

module.exports = mongoose.model('GameSession', gameSessionSchema); 