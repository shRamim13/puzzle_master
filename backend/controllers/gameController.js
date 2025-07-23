const GameSession = require('../models/GameSession');
const Puzzle = require('../models/Puzzle');
const Treasure = require('../models/Treasure');
const { calculatePoints, calculateTotalScore } = require('../utils/scoring');
const { GAME_CONFIG } = require('../config/constants');

// Start a new game session
const startGame = async (req, res) => {
  try {
    // Check if user already has an active game
    const existingGame = await GameSession.findOne({
      teamId: req.user.id,
      status: 'active'
    });

    if (existingGame) {
      return res.status(400).json({ 
        message: 'You already have an active game session' 
      });
    }

    const gameSession = new GameSession({
      teamId: req.user.id,
      teamName: req.user.teamName,
      currentLevel: 1,
      currentDifficulty: null,
      status: 'active',
      startTime: new Date(),
      totalPoints: 0,
      totalTime: 0,
      completedLevels: []
    });

    await gameSession.save();

    res.status(201).json({
      message: 'Game started successfully',
      gameSession
    });
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
      // Calculate points based on difficulty and time
      const points = calculatePoints(puzzle.difficulty, timeTaken);
      
      // Add completed level
      const completedLevel = {
        level: puzzle.level,
        difficulty: puzzle.difficulty,
        points,
        timeTaken,
        completedAt: new Date()
      };

      gameSession.completedLevels.push(completedLevel);
      gameSession.totalPoints += points;
      gameSession.totalTime += timeTaken;

      // Get treasure hint for this level and difficulty
      let treasureHint = null;
      let treasureLocation = null;
      let nextDestination = null;
      
      const treasure = await Treasure.findOne({
        level: puzzle.level,
        difficulty: puzzle.difficulty,
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
        gameSession.currentDifficulty = null;
      }

      await gameSession.save();

      res.json({
        isCorrect: true,
        message: 'Correct answer!',
        gameSession,
        points,
        treasureHint,
        treasureLocation,
        nextDestination
      });
    } else {
      res.json({
        isCorrect: false,
        message: 'Incorrect answer. Try again!'
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// End current game session
const endGame = async (req, res) => {
  try {
    const gameSession = await GameSession.findOneAndUpdate(
      {
        teamId: req.user.id,
        status: 'active'
      },
      {
        status: 'ended',
        endTime: new Date()
      },
      { new: true }
    );

    if (!gameSession) {
      return res.status(404).json({ message: 'No active game session found' });
    }

    res.json({
      message: 'Game ended successfully',
      gameSession
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await GameSession.aggregate([
      {
        $match: {
          status: { $in: ['completed', 'ended'] }
        }
      },
      {
        $addFields: {
          finalScore: {
            $add: [
              '$totalPoints',
              { $multiply: ['$totalTime', -0.1] } // Time penalty
            ]
          }
        }
      },
      {
        $sort: {
          isCompleted: -1, // Completed games first
          finalScore: -1,  // Then by score
          totalTime: 1     // Then by time
        }
      },
      {
        $project: {
          teamName: 1,
          totalPoints: 1,
          totalTime: 1,
          completedLevels: 1,
          isCompleted: 1,
          status: 1,
          finalScore: 1
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get available difficulties for current level
const getAvailableDifficulties = async (req, res) => {
  try {
    const gameSession = await GameSession.findOne({
      teamId: req.user.id,
      status: 'active'
    });

    if (!gameSession) {
      return res.status(404).json({ message: 'No active game session found' });
    }

    // Allow all difficulties for all levels
    const availableDifficulties = ['easy', 'medium', 'hard'];

    res.json({ availableDifficulties });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  startGame,
  getCurrentGame,
  submitAnswer,
  endGame,
  getLeaderboard,
  getAvailableDifficulties
}; 