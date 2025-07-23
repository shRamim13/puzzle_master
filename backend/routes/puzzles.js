const express = require('express');
const router = express.Router();
const { 
  getPuzzles, 
  createPuzzle, 
  updatePuzzle, 
  deletePuzzle, 
  getRandomPuzzle, 
  verifyAnswer 
} = require('../controllers/puzzleController');
const { adminAuth, captainAuth } = require('../middleware/auth');

// Admin routes
router.get('/', adminAuth, getPuzzles);
router.post('/', adminAuth, createPuzzle);
router.put('/:id', adminAuth, updatePuzzle);
router.delete('/:id', adminAuth, deletePuzzle);

// Captain routes
router.get('/random', captainAuth, getRandomPuzzle);
router.post('/:id/verify', captainAuth, verifyAnswer);

module.exports = router; 