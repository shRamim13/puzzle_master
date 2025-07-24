const GameSession = require('../models/GameSession');
const Puzzle = require('../models/Puzzle');
const Treasure = require('../models/Treasure');
const { calculatePoints } = require('../utils/scoring');
const { GAME_CONFIG } = require('../config/constants');

// Start new game session
const startGame = async (req, res) => {
  try {
    // Check if user already has an active session
    const existingSession = await GameSession.findOne({
      teamId: req.user.id,
      status: 'active'
    });

    if (existingSession) {
      return res.status(400).json({ message: 'You already have an active game session' });
    }

    const gameSession = new GameSession({
      teamId: req.user.id,
      teamName: req.user.teamName,
      currentLevel: 1
    });

    await gameSession.save();
    res.status(201).json(gameSession);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current game session
const getCurrentGame = async (req, res) => {
  try {
    const gameSession = await GameSession.findOne({
      teamId: req.user.id,
      status: 'active'
    });

    if (!gameSession) {
      return res.status(404).json({ message: 'No active game session found' });
    }

    res.json(gameSession);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit answer for current puzzle
const submitAnswer = async (req, res) => {
  try {
    const { puzzleId, answer, timeTaken } = req.body;

    const gameSession = await GameSession.findOne({
      teamId: req.user.id,
      status: 'active'
    });

    if (!gameSession) {
      return res.status(404).json({ message: 'No active game session found' });
    }

    const puzzle = await Puzzle.findById(puzzleId);
    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found' });
    }

    const isCorrect = puzzle.answer === answer.toLowerCase().trim();

    if (isCorrect) {
      // Calculate points based on time
      const points = calculatePoints(timeTaken);
      
      // Add completed level
      const completedLevel = {
        level: puzzle.level,
        puzzleId: puzzle._id,
        startTime: new Date(Date.now() - timeTaken * 1000),
        endTime: new Date(),
        timeTaken,
        points
      };

      gameSession.completedLevels.push(completedLevel);
      gameSession.totalPoints += points;
      gameSession.totalTime += timeTaken;

      // Get treasure hint for this level
      let treasureHint = null;
      let treasureLocation = null;
      let nextDestination = null;
      
      const treasure = await Treasure.findOne({
        level: puzzle.level,
        isActive: true
      });

      if (treasure) {
        treasureHint = treasure.clue;
        treasureLocation = treasure.location;
        nextDestination = treasure.nextDestination;
      }

      // Check if game is completed
      if (gameSession.completedLevels.length >= GAME_CONFIG.MAX_LEVELS) {
        gameSession.status = 'completed';
        gameSession.isCompleted = true;
        gameSession.endTime = new Date();
        gameSession.currentLevel = GAME_CONFIG.MAX_LEVELS;
      } else {
        // Move to next level
        gameSession.currentLevel = gameSession.completedLevels.length + 1;
      }

      await gameSession.save();

      res.json({
        isCorrect: true,
        points,
        treasureHint,
        treasureLocation,
        nextDestination,
        gameSession
      });
    } else {
      res.json({ isCorrect: false, points: 0 });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Complete treasure point
const completeTreasure = async (req, res) => {
  try {
    const { treasureCode } = req.body;

    const gameSession = await GameSession.findOne({
      teamId: req.user.id,
      status: 'active'
    });

    if (!gameSession) {
      return res.status(404).json({ message: 'No active game session found' });
    }

    const treasure = await Treasure.findOne({
      code: treasureCode,
      isActive: true
    });

    if (!treasure) {
      return res.status(404).json({ message: 'Invalid treasure code' });
    }

    // Check if already completed by this team
    const alreadyCompleted = treasure.completedBy.some(
      completion => completion.teamId.toString() === req.user.id
    );

    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Treasure already completed by your team' });
    }

    // Add completion record
    treasure.completedBy.push({
      teamId: req.user.id,
      completedAt: new Date()
    });

    await treasure.save();

    res.json({
      message: 'Treasure completed successfully',
      treasure,
      gameSession
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// End game session
const endGame = async (req, res) => {
  try {
    const gameSession = await GameSession.findOne({
      teamId: req.user.id,
      status: 'active'
    });

    if (!gameSession) {
      return res.status(404).json({ message: 'No active game session found' });
    }

    gameSession.status = 'completed';
    gameSession.endTime = new Date();
    await gameSession.save();

    res.json({ message: 'Game ended successfully', gameSession });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await GameSession.find({ status: 'completed' })
      .populate('teamId', 'teamName')
      .sort({ totalPoints: -1, totalTime: 1 })
      .limit(10);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  startGame,
  getCurrentGame,
  submitAnswer,
  completeTreasure,
  endGame,
  getLeaderboard
}; 