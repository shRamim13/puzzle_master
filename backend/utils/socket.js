const socketIo = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-leaderboard', () => {
      socket.join('leaderboard');
      console.log('Client joined leaderboard room');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

const emitLeaderboardUpdate = (leaderboardData) => {
  if (io) {
    io.to('leaderboard').emit('leaderboard-update', leaderboardData);
  }
};

const emitGameUpdate = (gameData) => {
  if (io) {
    io.to('leaderboard').emit('game-update', gameData);
  }
};

module.exports = {
  initializeSocket,
  emitLeaderboardUpdate,
  emitGameUpdate
}; 