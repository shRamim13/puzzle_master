const QRCode = require('../models/QRCode');
const Puzzle = require('../models/Puzzle');
const { generateUniqueCode } = require('../utils/qrGenerator');

// Generate QR code for a puzzle
const generateQRCode = async (req, res) => {
  try {
    const { puzzleId, clue, location } = req.body;

    const puzzle = await Puzzle.findById(puzzleId);
    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found' });
    }

    const code = generateUniqueCode();
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/game/puzzle/${code}`;

    const qrCode = new QRCode({
      code,
      level: puzzle.level,
      difficulty: puzzle.difficulty,
      puzzleId,
      clue,
      location,
      redirectUrl
    });

    await qrCode.save();

    res.status(201).json({
      message: 'QR Code generated successfully',
      qrCode: {
        id: qrCode._id,
        code: qrCode.code,
        level: qrCode.level,
        difficulty: qrCode.difficulty,
        clue: qrCode.clue,
        location: qrCode.location,
        redirectUrl: qrCode.redirectUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get puzzle by QR code
const getPuzzleByQRCode = async (req, res) => {
  try {
    const { code } = req.params;

    const qrCode = await QRCode.findOne({ code, isActive: true })
      .populate('puzzleId');

    if (!qrCode) {
      return res.status(404).json({ message: 'QR Code not found or inactive' });
    }

    // Update scan count
    qrCode.scanCount += 1;
    qrCode.lastScanned = new Date();
    await qrCode.save();

    res.json({
      puzzle: qrCode.puzzleId,
      clue: qrCode.clue,
      location: qrCode.location,
      level: qrCode.level,
      difficulty: qrCode.difficulty
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all QR codes (admin only)
const getAllQRCodes = async (req, res) => {
  try {
    const qrCodes = await QRCode.find()
      .populate('puzzleId', 'level difficulty question')
      .sort({ createdAt: -1 });

    res.json(qrCodes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Deactivate QR code
const deactivateQRCode = async (req, res) => {
  try {
    const { id } = req.params;

    const qrCode = await QRCode.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!qrCode) {
      return res.status(404).json({ message: 'QR Code not found' });
    }

    res.json({ message: 'QR Code deactivated successfully', qrCode });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  generateQRCode,
  getPuzzleByQRCode,
  getAllQRCodes,
  deactivateQRCode
}; 