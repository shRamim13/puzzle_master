const mongoose = require('mongoose');

const treasureSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  clue: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  nextDestination: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  points: {
    type: Number,
    default: 10
  },
  completedBy: [{
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Treasure', treasureSchema); 