const express = require('express');
const router = express.Router();
const { 
  generateQRCode, 
  getPuzzleByQRCode, 
  getAllQRCodes, 
  deactivateQRCode 
} = require('../controllers/qrController');
const { adminAuth } = require('../middleware/auth');

// Public routes
router.get('/puzzle/:code', getPuzzleByQRCode);

// Admin routes
router.post('/generate', adminAuth, generateQRCode);
router.get('/all', adminAuth, getAllQRCodes);
router.put('/deactivate/:id', adminAuth, deactivateQRCode);

module.exports = router; 