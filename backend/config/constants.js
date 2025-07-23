const GAME_CONFIG = {
  MAX_LEVELS: 5,
  DIFFICULTIES: ['easy', 'medium', 'hard'],
  MAX_TEAM_SIZE: 5,
  MIN_TEAM_SIZE: 4
};

const SCORING = {
  EASY_POINTS: 10,
  MEDIUM_POINTS: 20,
  HARD_POINTS: 30,
  TIME_MULTIPLIER: 0.1
};

const JWT_EXPIRY = '24h';

module.exports = {
  GAME_CONFIG,
  SCORING,
  JWT_EXPIRY
}; 