const express = require('express');
const router = express.Router();
const treasureController = require('../controllers/treasureController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.get('/', treasureController.getAllTreasures);
router.get('/stats', treasureController.getTreasureStats);

// Protected routes (require authentication)
router.post('/verify', auth, treasureController.verifyTreasureCode);

// Admin routes (require admin role)
router.post('/', auth, admin, treasureController.createTreasure);
router.put('/:id', auth, admin, treasureController.updateTreasure);
router.delete('/:id', auth, admin, treasureController.deleteTreasure);

// This should be last to avoid conflicts with /stats
router.get('/:code', treasureController.getTreasureByCode);

module.exports = router; 