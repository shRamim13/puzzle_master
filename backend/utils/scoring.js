const calculatePoints = (timeTaken) => {
  // Base points for completing a puzzle
  const basePoints = 10;
  
  // Time bonus: faster completion gives more points
  const timeBonus = Math.max(0, 20 - Math.floor(timeTaken / 10));
  
  return basePoints + timeBonus;
};

const calculateTotalScore = (totalPoints, totalTime) => {
  // Final score calculation
  return totalPoints - Math.floor(totalTime / 60); // 1 point penalty per minute
};

module.exports = {
  calculatePoints,
  calculateTotalScore
}; 