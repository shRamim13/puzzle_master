const express = require('express');
const router = express.Router();
const { 
  startGame, 
  getCurrentGame, 
  submitAnswer, 
  endGame, 
  getLeaderboard, 
  getAvailableDifficulties 
} = require('../controllers/gameController');
const { captainAuth, auth } = require('../middleware/auth');

// Captain routes
router.post('/start', captainAuth, startGame);
router.get('/current', captainAuth, getCurrentGame);
router.post('/submit-answer', captainAuth, submitAnswer);
router.post('/end', captainAuth, endGame);
router.get('/available-difficulties', captainAuth, getAvailableDifficulties);

// Public routes
router.get('/leaderboard', auth, getLeaderboard);

module.exports = router; 