const Puzzle = require('../models/Puzzle');
const { calculatePoints } = require('../utils/scoring');

// Get all puzzles (admin only)
const getPuzzles = async (req, res) => {
  try {
    const puzzles = await Puzzle.find().sort({ level: 1 });
    res.json(puzzles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new puzzle (admin only)
const createPuzzle = async (req, res) => {
  try {
    const { level, question, answer, questionType, points, hints, treasureClue, treasureLocation, nextDestination } = req.body;

    const puzzle = new Puzzle({
      level,
      question,
      answer: answer.toLowerCase().trim(),
      questionType,
      points: points || 10,
      hints: hints ? hints.split('\n').filter(hint => hint.trim()) : [],
      createdBy: req.user.id
    });

    await puzzle.save();

    // If treasure clue data is provided, create or update treasure
    if (treasureClue && treasureLocation && nextDestination) {
      const Treasure = require('../models/Treasure');
      
      // Check if treasure already exists for this level
      let treasure = await Treasure.findOne({ level });
      
      if (treasure) {
        // Update existing treasure
        treasure.clue = treasureClue;
        treasure.location = treasureLocation;
        treasure.nextDestination = nextDestination;
        await treasure.save();
      } else {
        // Create new treasure
        treasure = new Treasure({
          code: `TREASURE${level.toString().padStart(3, '0')}`,
          level,
          clue: treasureClue,
          location: treasureLocation,
          nextDestination
        });
        await treasure.save();
      }
    }

    res.status(201).json(puzzle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update puzzle (admin only)
const updatePuzzle = async (req, res) => {
  try {
    const { level, question, answer, questionType, points, hints, treasureClue, treasureLocation, nextDestination } = req.body;

    const puzzle = await Puzzle.findByIdAndUpdate(
      req.params.id,
      {
        level,
        question,
        answer: answer.toLowerCase().trim(),
        questionType,
        points: points || 10,
        hints: hints ? hints.split('\n').filter(hint => hint.trim()) : []
      },
      { new: true }
    );

    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found' });
    }

    // If treasure clue data is provided, create or update treasure
    if (treasureClue && treasureLocation && nextDestination) {
      const Treasure = require('../models/Treasure');
      
      // Check if treasure already exists for this level
      let treasure = await Treasure.findOne({ level });
      
      if (treasure) {
        // Update existing treasure
        treasure.clue = treasureClue;
        treasure.location = treasureLocation;
        treasure.nextDestination = nextDestination;
        await treasure.save();
      } else {
        // Create new treasure
        treasure = new Treasure({
          code: `TREASURE${level.toString().padStart(3, '0')}`,
          level,
          clue: treasureClue,
          location: treasureLocation,
          nextDestination
        });
        await treasure.save();
      }
    }

    res.json(puzzle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete puzzle (admin only)
const deletePuzzle = async (req, res) => {
  try {
    const puzzle = await Puzzle.findByIdAndDelete(req.params.id);
    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found' });
    }
    res.json({ message: 'Puzzle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get random puzzle for a level
const getRandomPuzzle = async (req, res) => {
  try {
    const { level } = req.query;

    const puzzle = await Puzzle.aggregate([
      { $match: { level: parseInt(level) } },
      { $sample: { size: 1 } }
    ]);

    if (!puzzle.length) {
      return res.status(404).json({ message: 'No puzzle found for this level' });
    }

    // Don't send the answer to the client
    const puzzleWithoutAnswer = {
      ...puzzle[0],
      answer: undefined
    };

    res.json(puzzleWithoutAnswer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify answer
const verifyAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const puzzle = await Puzzle.findById(req.params.id);

    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found' });
    }

    const isCorrect = puzzle.answer === answer.toLowerCase().trim();
    res.json({ isCorrect, points: isCorrect ? puzzle.points : 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPuzzles,
  createPuzzle,
  updatePuzzle,
  deletePuzzle,
  getRandomPuzzle,
  verifyAnswer
}; 