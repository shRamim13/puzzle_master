const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  level: {
    type: Number,
    required: true
  },
  puzzleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Puzzle',
    required: true
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
  redirectUrl: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  scanCount: {
    type: Number,
    default: 0
  },
  lastScanned: Date
}, {
  timestamps: true
});

qrCodeSchema.index({ code: 1 });
qrCodeSchema.index({ level: 1 });

module.exports = mongoose.model('QRCode', qrCodeSchema); 