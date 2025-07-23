const { SCORING } = require('../config/constants');

// Calculate points based on difficulty and time taken
const calculatePoints = (difficulty, timeTaken = 0) => {
  let basePoints;
  
  switch (difficulty) {
    case 'easy':
      basePoints = SCORING.EASY_POINTS;
      break;
    case 'medium':
      basePoints = SCORING.MEDIUM_POINTS;
      break;
    case 'hard':
      basePoints = SCORING.HARD_POINTS;
      break;
    default:
      basePoints = SCORING.EASY_POINTS;
  }

  // Apply time penalty
  const timePenalty = timeTaken * SCORING.TIME_MULTIPLIER;
  const finalPoints = Math.max(1, basePoints - timePenalty);

  return Math.round(finalPoints);
};

// Calculate total score from completed levels
const calculateTotalScore = (completedLevels) => {
  const totalPoints = completedLevels.reduce((sum, level) => sum + level.points, 0);
  const totalTime = completedLevels.reduce((sum, level) => sum + level.timeTaken, 0);

  return {
    totalPoints,
    totalTime,
    finalScore: totalPoints - (totalTime * SCORING.TIME_MULTIPLIER)
  };
};

// Get difficulty progression based on current difficulty
const getDifficultyProgression = (currentDifficulty) => {
  const difficulties = ['easy', 'medium', 'hard'];
  const currentIndex = difficulties.indexOf(currentDifficulty);
  
  if (currentIndex === -1) {
    return ['easy', 'medium', 'hard'];
  }
  
  // Can only select current difficulty or lower
  return difficulties.slice(0, currentIndex + 1);
};

module.exports = {
  calculatePoints,
  calculateTotalScore,
  getDifficultyProgression
}; 