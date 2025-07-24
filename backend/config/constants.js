const GAME_CONFIG = {
  MAX_LEVELS: 5,
  MAX_TEAM_SIZE: 5,
  MIN_TEAM_SIZE: 4
};

const SCORING = {
  BASE_POINTS: 10,
  TIME_BONUS: 20,
  TIME_PENALTY: 1
};

const JWT_EXPIRY = '24h';

module.exports = {
  GAME_CONFIG,
  SCORING,
  JWT_EXPIRY
}; 