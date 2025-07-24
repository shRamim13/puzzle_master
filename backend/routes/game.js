const express = require('express');
const router = express.Router();
const { 
  startGame, 
  getCurrentGame, 
  submitAnswer, 
  completeTreasure,
  endGame, 
  getLeaderboard
} = require('../controllers/gameController');
const { captainAuth, auth } = require('../middleware/auth');

// Captain routes
router.post('/start', captainAuth, startGame);
router.get('/current', captainAuth, getCurrentGame);
router.post('/submit-answer', captainAuth, submitAnswer);
router.post('/complete-treasure', captainAuth, completeTreasure);
router.post('/end', captainAuth, endGame);

// Public routes
router.get('/leaderboard', auth, getLeaderboard);

module.exports = router; 