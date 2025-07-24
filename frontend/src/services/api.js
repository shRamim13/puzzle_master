import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server might be slow');
    } else {
      console.error('API Error:', error.response?.data || error.message);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Puzzle API
export const puzzleAPI = {
  getPuzzles: () => api.get('/puzzles'),
  createPuzzle: (puzzleData) => api.post('/puzzles', puzzleData),
  updatePuzzle: (id, puzzleData) => api.put(`/puzzles/${id}`, puzzleData),
  deletePuzzle: (id) => api.delete(`/puzzles/${id}`),
  getRandomPuzzle: (level) => api.get(`/puzzles/random?level=${level}`),
  verifyAnswer: (puzzleId, answer) => api.post(`/puzzles/${puzzleId}/verify`, { answer }),
};

// Game API
export const gameAPI = {
  startGame: () => api.post('/game/start'),
  getCurrentGame: () => api.get('/game/current'),
  submitAnswer: (data) => api.post('/game/submit-answer', data),
  completeTreasure: (data) => api.post('/game/complete-treasure', data),
  endGame: () => api.post('/game/end'),
  getLeaderboard: () => api.get('/game/leaderboard'),
};

// Treasure API
export const treasureAPI = {
  getAllTreasures: () => api.get('/treasure'),
  getTreasures: () => api.get('/treasure'),
  getTreasureByCode: (code) => api.get(`/treasure/${code}`),
  verifyTreasureCode: (code) => api.post('/treasure/verify', { code }),
  createTreasure: (treasureData) => api.post('/treasure', treasureData),
  updateTreasure: (id, treasureData) => api.put(`/treasure/${id}`, treasureData),
  deleteTreasure: (id) => api.delete(`/treasure/${id}`),
  getTreasureStats: () => api.get('/treasure/stats'),
};

export default api; 